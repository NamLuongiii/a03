package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"quickstart/env"
	"quickstart/models"
	"quickstart/queue"
	"quickstart/types"

	"google.golang.org/genai"
)

// Khai báo struct cho kết quả
type BookClassification struct {
	Book string `json:"book"`
	Cate string `json:"cate"`
}

type BookInput struct {
	Book   string `json:"book"`
	Author string `json:"author"`
}

type AutomationServiceInterface interface {
	AutomateCategories(
		ctx context.Context,
		books []BookInput,
		categories []string,
	) ([]BookClassification, error)
	ProcessingBook() (bool, error)
}

type AutomationServiceImpl struct {
	client         *genai.Client
	model          string
	queueClient    *queue.Client
	bookRepository models.BookRepositoryInterface
}

func NewAutomationService(queueClient *queue.Client, bookRepository models.BookRepositoryInterface) AutomationServiceInterface {
	key := env.GetEnv(env.GEMINI_KEY)
	modelName := env.GetEnv(env.GEMINI_MODEL)
	ctx := context.Background()

	// Khởi tạo client 1 lần duy nhất
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  key,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		log.Fatalf("Failed to create Gemini client: %v", err)
	}

	return &AutomationServiceImpl{
		client:         client,
		model:          modelName,
		queueClient:    queueClient,
		bookRepository: bookRepository,
	}
}

func (a *AutomationServiceImpl) AutomateCategories(ctx context.Context, books []BookInput, categories []string) ([]BookClassification, error) {
	// 1. Tạo nội dung Prompt chi tiết hơn
	prompt := fmt.Sprintf(
		"Sử dụng Google Search để tra cứu thông tin và phân loại danh sách sách sau: %v. "+
			"Chỉ được chọn 1 category phù hợp nhất từ danh sách cho trước: %v. "+
			"Nếu không tìm thấy thông tin chính xác, hãy dựa vào tên sách để suy luận.",
		books, categories,
	)

	// 2. Cấu hình Model với Google Search Tool
	config := &genai.GenerateContentConfig{
		// Kích hoạt tính năng Search Grounding
		Tools: []*genai.Tool{
			{GoogleSearch: &genai.GoogleSearch{}},
		},
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeArray,
			Items: &genai.Schema{
				Type:     genai.TypeObject,
				Required: []string{"book", "cate"},
				Properties: map[string]*genai.Schema{
					"book": {Type: genai.TypeString},
					"cate": {Type: genai.TypeString, Enum: categories},
				},
			},
		},
		SystemInstruction: &genai.Content{
			Parts: []*genai.Part{{Text: "Bạn là thủ thư chuyên nghiệp. Luôn sử dụng công cụ tìm kiếm để xác định thể loại sách chính xác trước khi trả về kết quả."}},
		},
	}

	// 3. Gọi API (Sử dụng model Gemini 2.0/3.0 Flash/Pro đều hỗ trợ Search)
	resp, err := a.client.Models.GenerateContent(ctx, a.model, genai.Text(prompt), config)
	if err != nil {
		return nil, fmt.Errorf("gemini error: %w", err)
	}

	// 4. Parse dữ liệu
	var result []BookClassification
	if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
		jsonRaw := resp.Candidates[0].Content.Parts[0].Text

		// Lưu ý: Đôi khi AI trả về markdown ```json ... ```, thư viện mới thường tự xử lý
		// nhưng nếu dùng json.Unmarshal thủ công bạn nên check sạch chuỗi
		err := json.Unmarshal([]byte(jsonRaw), &result)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal json: %w", err)
		}
	}

	return result, nil
}

// ProcessingBook Create job book processing and add to queue
func (a *AutomationServiceImpl) ProcessingBook() (bool, error) {
	books, e := a.bookRepository.GetAll(types.PaginationParams{
		Page: 1,
		Size: 24,
	})

	if e != nil {
		return false, e
	}

	for _, b := range books.Items.([]models.Book) {
		task, e := queue.NewBookProcessTask(b.ID)
		if e != nil {
			fmt.Println(e)
			continue
		}

		info, err := a.queueClient.Enqueue(task)
		if err != nil {
			// handle error
			fmt.Println(err)
			continue
		}

		fmt.Println("Enqueue success", info.ID)
	}
	return true, nil
}
