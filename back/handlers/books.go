package handlers

import (
	"quickstart/models"

	"github.com/gin-gonic/gin"
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
	}
}

func (h *BooksHandler) GetBooks(c *gin.Context) {
	books := make([]*models.Book, 0)
	c.JSON(200, books)
}

func (h *BooksHandler) GetFeaturedBooks() bool {
	return true
}

func (h *BooksHandler) GetBookByID(id int) (*models.Book, error) {
	return nil, nil
}

func (h *BooksHandler) GetCategories() ([]*models.Category, error) {
	return make([]*models.Category, 0), nil
}

func (h *BooksHandler) GetPopularBooks() ([]*models.Book, error) {
	return make([]*models.Book, 0), nil
}

func (h *BooksHandler) GetAuthors() ([]*models.Author, error) {
	return make([]*models.Author, 0), nil
}

func (h *BooksHandler) AddComment(bookId int, comment *models.Comment) error {
	return nil
}

func (h *BooksHandler) AddRating(bookId int, rating *models.BookRating) error {
	return nil
}

func (h *BooksHandler) GetBooksInSeries(seriesId int) ([]*models.Book, error) {
	return make([]*models.Book, 0), nil
}
