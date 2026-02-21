package handlers

import (
	"errors"
	"net/http"
	"quickstart/dtos"
	"quickstart/middleware"
	"quickstart/models"
	"quickstart/types"

	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
)

type BooksHandler struct {
	bookRepository          models.BookRepositoryInterface
	categoryRepository      models.CategoryRepositoryInterface
	authorRepository        models.AuthorRepositoryInterface
	commentRepository       models.CommentRepositoryInterface
	featuredGroupRepository models.FeaturedBookGroupRepositoryInterface
	digitalBookRepository   models.DigitalBookRepositoryInterface
	bookSeriesRepository    models.BookSeriesRepositoryInterface
	bookRatingRepository    models.BookRatingRepositoryInterface
	fileStorage             FileStorageInterface
	imageProcessor          ImageProcessorInterface
	imageRepository         models.ImageRepositoryInterface
}

type BookParams struct {
	BookRepository          models.BookRepositoryInterface
	CategoryRepository      models.CategoryRepositoryInterface
	AuthorRepository        models.AuthorRepositoryInterface
	CommentRepository       models.CommentRepositoryInterface
	FeaturedGroupRepository models.FeaturedBookGroupRepositoryInterface
	DigitalBookRepository   models.DigitalBookRepositoryInterface
	BookSeriesRepository    models.BookSeriesRepositoryInterface
	BookRatingRepository    models.BookRatingRepositoryInterface
	FileStorage             FileStorageInterface
	ImageProcessor          ImageProcessorInterface
	ImageRepository         models.ImageRepositoryInterface
}

func NewBooksHandler(params BookParams) *BooksHandler {
	return &BooksHandler{
		bookRepository:          params.BookRepository,
		categoryRepository:      params.CategoryRepository,
		authorRepository:        params.AuthorRepository,
		commentRepository:       params.CommentRepository,
		featuredGroupRepository: params.FeaturedGroupRepository,
		digitalBookRepository:   params.DigitalBookRepository,
		bookSeriesRepository:    params.BookSeriesRepository,
		bookRatingRepository:    params.BookRatingRepository,
		fileStorage:             params.FileStorage,
		imageProcessor:          params.ImageProcessor,
		imageRepository:         params.ImageRepository,
	}
}

// GetBooks godoc
//
//	@Summary	Get all books
//	@Tags		books
//	@Router		/books [get]
//	@Success	200	{array}	models.Book	"OK"
func (h *BooksHandler) GetBooks(c *gin.Context) {
	b, e := h.bookRepository.GetAll()
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    b,
	})
}

// GetFeaturedBooks godoc
//
//	@Summary	Get featured books
//	@Tags		books
//	@Router		/books/featured [get]
//	@Param		recommender	query	string		true	"recommender"
//	@Success	200			{array}	models.Book	"OK"
func (h *BooksHandler) GetFeaturedBooks(c *gin.Context) {
	recommender := c.Query("recommender")

	if recommender == "new-books" {
		bs, e := h.bookRepository.GetNewestBooks(10)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Data:    bs,
		})
	} else if recommender == "popular-books" {
		bs, e := h.bookRepository.GetPopularBooks(10)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Data:    bs,
		})
	} else if recommender == "books-other-users-liked" {
		bs, e := h.bookRepository.GetBooksOtherUserRead(10)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Data:    bs,
		})
	}

}

// GetBookByID godoc
//
//	@Summary	Get a book by ID
//	@Tags		books
//	@Router		/books/{id} [get]
//	@Param		id	path	string	true	"Book ID"
func (h *BooksHandler) GetBookByID(c *gin.Context) {
	id := c.Param("id")

	b, e := h.bookRepository.GetByID(id)

	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    b,
	})

}

// GetCategories godoc
//
//	@Summary	Get all categories
//	@Tags		books
//	@Router		/books/categories [get]
//	@Success	200	{array}	models.Category	"OK"
func (h *BooksHandler) GetCategories(c *gin.Context) {
	cs, e := h.categoryRepository.GetAll()
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    cs,
	})
}

// GetAuthors godoc
//
//	@Summary	Get an author by ID
//	@Tags		books
//	@Router		/books/authors/{authorID} [get]
//	@Param		authorID	path	string	true	"Author ID"
func (h *BooksHandler) GetAuthors(c *gin.Context) {
	id := c.Param("authorID")
	author, e := h.authorRepository.GetByID(id)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    author,
	})
}

// AddComment godoc
//
//	@Summary	Add a comment to a book
//	@Tags		books
//	@Router		/books/{bookID}/comments [post]
//	@Param		bookID	path	string			true	"Book ID"
//	@Param		comment	body	dtos.CommentDto	true	"Comment"
//	@Sucesss	200 {object} types.CommonResponse {data=models.Comment}
func (h *BooksHandler) AddComment(c *gin.Context) {
	bID := c.Param("bookID")
	uID := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims).ID

	var body dtos.CommentDto
	if err := c.ShouldBindJSON(&body); err != nil {
		c.Error(middleware.NewBadRequestError(err.Error()))
		return
	}

	comment := &models.Comment{
		BookID:    bID,
		AccountID: uID,
		Content:   body.Text,
		Title:     body.Title,
	}
	er := h.commentRepository.Create(comment)
	if er != nil {
		c.Error(middleware.NewServerInternalError(er.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    comment,
	})
}

// AddRating godoc
//
//	@Summary	Add a rating to a book
//	@Tags		books
//	@Router		/books/{bookID}/ratings [post]
//	@Param		bookID	path	string			true	"Book ID"
//	@Param		rating	body	dtos.RatingDto	true	"Rating"
//	@Sucesss	200 {object} types.CommonResponse {data=models.Rating}
func (h *BooksHandler) AddRating(c *gin.Context) {
	bID := c.Param("bookID")

	b, e := h.bookRepository.GetByID(bID)
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}

	var body dtos.RatingDto
	if err := c.ShouldBindJSON(&body); err != nil {
		c.Error(middleware.NewBadRequestError(err.Error()))
		return
	}
	uID := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims).ID

	br := &models.BookRating{
		AccountID: uID,
		BookID:    bID,
		Rating:    body.Rating,
	}

	er := h.bookRatingRepository.Create(br)
	if er != nil {
		c.Error(middleware.NewServerInternalError(er.Error()))
		return
	}

	// update book rating
	b.RatingAvg = (float64(b.RatingCount)*b.RatingAvg + float64(br.Rating)) / float64(b.RatingCount)
	b.RatingCount += 1
	e = h.bookRepository.Update(b)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    br,
	})

}

// CreateBook godoc
//
//	@Summary	Create a new book
//	@Tags		books
//	@Router		/books [post]
//	@Accept		multipart/form-data
//	@Param		name		formData	string	true	"Book name"
//	@Param		description	formData	string	false	"Description"
//	@Param		summary		formData	string	false	"Summary"
//	@Param		category_id	formData	string	false	"Category ID"
//	@Param		author_id	formData	string	false	"Author ID"
//	@Param		cover		formData	file	false	"Cover image"
//	@Param		files		formData	[]file	false	"Digital book files"
//	@Success	200			{object}	types.CommonResponse{data=models.Book}
//	@Security	BearerAuth
func (h *BooksHandler) CreateBook(c *gin.Context) {
	name := c.PostForm("name")

	// create a book
	book := &models.Book{
		ID:   slug.Make(name),
		Name: name,
	}

	cover, e := c.FormFile("cover")
	if e != nil {
		if errors.Is(e, http.ErrMissingFile) {
			cover = nil
		} else {
			c.Error(middleware.NewBadRequestError(e.Error()))
			return
		}
	}

	if cover != nil {
		xs, sm, md, xsn, smn, mdn, e := h.imageProcessor.ProcessImage(cover)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		xsUrl, e := h.fileStorage.UploadFile(xs, xsn, FolderBookCovers)
		smUrl, e1 := h.fileStorage.UploadFile(sm, smn, FolderBookCovers)
		mdUrl, e2 := h.fileStorage.UploadFile(md, mdn, FolderBookCovers)
		if e != nil || e1 != nil || e2 != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}

		dbImg := &models.Image{
			XS: xsUrl,
			SM: smUrl,
			MD: mdUrl,
		}
		e3 := h.imageRepository.Create(dbImg)
		if e3 != nil {
			c.Error(middleware.NewServerInternalError(e3.Error()))
			return
		}

		book.CoverID = &dbImg.ID
	}

	e = h.bookRepository.Create(book)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	// Get multipart form
	mf, e := c.MultipartForm()
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}

	// Get digital book files
	files, _ := mf.File["files"]
	for _, fh := range files {

		file, err := fh.Open()
		if err != nil {
			c.Error(middleware.NewServerInternalError(err.Error()))
			return
		}
		url, e := h.fileStorage.UploadFile(file, fh.Filename, FolderBookFiles)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}

		db := models.DigitalBook{
			Name:     fh.Filename,
			FileType: fh.Header["Content-Type"][0],
			FileSize: fh.Size,
			BookID:   book.ID,
			URL:      url,
		}

		er := h.digitalBookRepository.Create(&db)
		if er != nil {
			c.Error(middleware.NewServerInternalError(er.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Data:    book,
		Success: true,
		Message: "Book created",
	})

}
