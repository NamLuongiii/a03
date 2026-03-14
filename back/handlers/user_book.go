package handlers

import (
	"quickstart/services"
	"quickstart/types"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UserBookHandlerInterface interface {
	AddBookToUser(c *gin.Context)
	RemoveBookFromUser(c *gin.Context)
	GetBooksByUser(c *gin.Context)
	FindByID(c *gin.Context)
}

type UserBookHandler struct {
	userBookServiceInterface services.UserBookServiceInterface
}

func NewUserBookHandler(userBookServiceInterface services.UserBookServiceInterface) UserBookHandlerInterface {
	return &UserBookHandler{
		userBookServiceInterface: userBookServiceInterface,
	}
}

type UserBookParams struct {
	BookID string `json:"book_id"`
}

// AddBookToUser godoc
//
//	@Summary		Add book to user
//	@Description	Add book to user
//	@Tags			UserBooks
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UserBookParams			true	"Book ID"
//	@Success		200		{object}	types.CommonResponse	"Book added to user"
//	@Router			/user-books [post]
//	@Security		BearerAuth
func (uh *UserBookHandler) AddBookToUser(c *gin.Context) {
	claims := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims)
	var body UserBookParams

	userID := claims.ID
	e := c.ShouldBindJSON(&body)
	if e != nil {
		c.Error(e)
		return
	}
	bookID := body.BookID

	e = uh.userBookServiceInterface.AddBookToUser(userID, bookID)
	if e != nil {
		c.Error(e)
		return
	}
	c.JSON(200, types.CommonResponse{
		Data:    nil,
		Success: true,
		Message: "Book added to user",
	})
}

// RemoveBookFromUser godoc
//
//	@Summary		Remove book from user
//	@Description	Remove book from user
//	@Tags			UserBooks
//	@Accept			json
//	@Produce		json
//	@Param			book_id	path		string					true	"Book ID"
//	@Success		200		{object}	types.CommonResponse	"Book removed from user"
//	@Router			/user-books/{book_id} [delete]
//	@Security		BearerAuth
func (uh *UserBookHandler) RemoveBookFromUser(c *gin.Context) {
	claims := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims)
	userID := claims.ID
	bookID := c.Param("bookID")

	e := uh.userBookServiceInterface.RemoveBookFromUser(userID, bookID)
	if e != nil {
		c.Error(e)
		return
	}
	c.JSON(200, types.CommonResponse{
		Data:    nil,
		Success: true,
		Message: "Book removed from user",
	})
}

// GetBooksByUser godoc
//
//	@Summary		Get books by user
//	@Description	Get books by user
//	@Tags			UserBooks
//	@Accept			json
//	@Produce		json
//	@Param			limit	query		int										false	"Limit"
//	@Success		200		{object}	types.CommonResponse{models.UserBook[]}	"Books retrieved"
//	@Router			/user-books [get]
//	@Security		BearerAuth
func (uh *UserBookHandler) GetBooksByUser(c *gin.Context) {
	claims := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims)
	userID := claims.ID
	limit := c.DefaultQuery("limit", "5")
	numLimit, err := strconv.Atoi(limit)
	if err != nil {
		c.Error(err)
		return
	}

	userBooks, e := uh.userBookServiceInterface.GetBooksByUser(userID, numLimit)
	if e != nil {
		c.Error(e)
		return
	}
	c.JSON(200, types.CommonResponse{
		Data:    userBooks,
		Success: true,
		Message: "Books retrieved",
	})
}

// Find by ID godoc
//
//	@Summary	Get user book by book ID
//	@Tags		UserBooks
//	@Accept		json
//	@Produce	json
//	@Param		bookID	path		string									true	"Book ID"
//	@Success	200		{object}	types.CommonResponse{models.UserBook}	"Books retrieved"
//	@Router		/user-books/{bookID} [get]
//	@Security	BearerAuth
func (uh *UserBookHandler) FindByID(c *gin.Context) {
	claims := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims)
	userID := claims.ID
	bookID := c.Param("bookID")

	ub, e := uh.userBookServiceInterface.FindByID(userID, bookID)
	if e != nil {
		c.Error(e)
		return
	}

	c.JSON(200, types.CommonResponse{
		Data:    ub,
		Success: true,
		Message: "Book retrieved",
	})
}
