package handlers

import (
	"errors"
	"fmt"
	"quickstart/dto"
	"quickstart/models"
	"quickstart/services"
	"quickstart/types"

	"github.com/gin-gonic/gin"
)

type AutomationHandlerInterface interface {
	Task(c *gin.Context)
	BookProcessing(c *gin.Context)
}

type AutomationHandler struct {
	automationService  services.AutomationServiceInterface
	bookRepository     models.BookRepositoryInterface
	categoryRepository models.CategoryRepositoryInterface
}

func NewAutomationHandler(automationService services.AutomationServiceInterface,
	bookRepository models.BookRepositoryInterface,
	categoryRepository models.CategoryRepositoryInterface) AutomationHandlerInterface {
	return &AutomationHandler{
		automationService:  automationService,
		bookRepository:     bookRepository,
		categoryRepository: categoryRepository,
	}
}

// Task godoc
//
//	@Summary		Automation task
//	@Description	Automation task
//	@Tags			Automation
//	@Accept			json
//	@Produce		json
//	@Router			/automation/task [post]
//	@Security		BearerAuth
//	@Param			task	body		dto.AutomationTaskDto	true	"Automation task"
//	@Success		200		{object}	types.CommonResponse{}
func (a *AutomationHandler) Task(c *gin.Context) {
	body := &dto.AutomationTaskDto{}
	if err := c.ShouldBindJSON(body); err != nil {
		c.JSON(400, types.CommonResponse{Success: false, Message: "Invalid input"})
		return
	}

	// Get categories
	categoryNamess, cateMap, e := a.getCategoriesData()
	if e != nil {
		c.Error(e)
		return
	}

	if body.TaskName == "auto-category" {
		// Truyền context từ request vào service
		// Giả sử bạn truyền thêm list sách và category từ body hoặc config
		for i := 9; i <= 108; i++ {

			books, bookInput, e := a.getInputByPage(i, 24)
			if len(books) == 0 {
				continue
			}

			r, e := a.automationService.AutomateCategories(c.Request.Context(), bookInput, categoryNamess)

			if e != nil {
				fmt.Println("call gemini failed at page :", i)
				return
			}

			for index, result := range r {
				e := a.bookRepository.UpdateBookCategory(books[index].ID, cateMap[result.Cate])
				if e != nil {
					fmt.Println("update date category failed at page: ", i)
					continue
				}
			}

			fmt.Println("🧧🧧🧧Done page ", i)
		}

		c.JSON(200, types.CommonResponse{
			Success: true,
		})
		return // Nhớ return để không chạy xuống phần dưới
	}

	c.JSON(200, types.CommonResponse{
		Success: true,
		Data:    body.TaskName,
	})
}

func (a *AutomationHandler) getInputByPage(page int, size int) ([]models.Book,
	[]services.BookInput, error) {
	// Get book by page
	if page == 0 {
		page = 1
	}
	if size == 0 {
		size = 24
	}
	pb, _ := a.bookRepository.GetAll(types.PaginationParams{
		Page: page,
		Size: size,
	})
	books, ok := pb.Items.([]models.Book)
	if !ok {
		return nil, nil, errors.New("get books by page failed")
	}

	var filtedBooks []models.Book
	for _, books := range books {
		if books.Author != nil {
			filtedBooks = append(filtedBooks, books)
		}
	}

	// Get books by page
	var input []services.BookInput
	for _, book := range filtedBooks {

		input = append(input, services.BookInput{
			Book:   book.Name,
			Author: book.Author.Name,
		})
	}

	return filtedBooks, input, nil
}

func (a *AutomationHandler) getCategoriesData() ([]string, map[string]string, error) {
	// Get categories
	categories, e := a.categoryRepository.GetAll()
	if e != nil {
		return nil, nil, e
	}
	cateMap := make(map[string]string)
	var cates []string
	for _, category := range categories {
		cates = append(cates, category.Name)
		cateMap[category.Name] = category.ID
	}

	return cates, cateMap, nil
}

// BookProcessing godoc
//
//	@Summary		Book processing
//	@Description	Book processing
//	@Tags			Automation
//	@Accept			json
//	@Produce		json
//	@Router			/automation/book-processing [post]
//	@Security		BearerAuth
//	@Success		200		{object}	types.CommonResponse{}
func (a *AutomationHandler) BookProcessing(c *gin.Context) {
	v, e := a.automationService.ProcessingBook()
	if e != nil {
		c.Error(e)
		return
	}

	c.JSON(200, types.CommonResponse{
		Success: true,
		Data:    v,
	})
}
