package services

import (
	"quickstart/models"
)

type UserBookServiceInterface interface {
	AddBookToUser(userID int, bookID string) error
	RemoveBookFromUser(userID int, bookID string) error
	GetBooksByUser(userID int, limit int) ([]models.UserBook, error)
}

type UserBookServiceImpl struct {
	bookRepositoryInterface    models.BookRepositoryInterface
	accountRepositoryInterface models.AccountRepositoryInterface
	userBookModelInterface     models.UserBookRepositoryInterface
}

func NewUserBookService(
	bookRepositoryInterface models.BookRepositoryInterface,
	accountRepositoryInterface models.AccountRepositoryInterface,
	userBookModelInterface models.UserBookRepositoryInterface) UserBookServiceInterface {
	return &UserBookServiceImpl{
		bookRepositoryInterface:    bookRepositoryInterface,
		accountRepositoryInterface: accountRepositoryInterface,
		userBookModelInterface:     userBookModelInterface,
	}
}

func (s *UserBookServiceImpl) AddBookToUser(userID int, bookID string) error {
	_, e := s.bookRepositoryInterface.GetByIDSimple(bookID)
	if e != nil {
		return e
	}

	userBook := &models.UserBook{
		AccountID: userID,
		BookID:    bookID,
	}
	return s.userBookModelInterface.Create(userBook)
}

func (s *UserBookServiceImpl) RemoveBookFromUser(userID int, bookID string) error {
	return s.userBookModelInterface.DeleteByID(userID, bookID)
}

func (s *UserBookServiceImpl) GetBooksByUser(userID int, limit int) ([]models.UserBook, error) {
	return s.userBookModelInterface.GetBooksByUser(userID, limit)
}
