package handlers

import (
	"errors"
	"net/http"
	"quickstart/models"
	"quickstart/types"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProfileHandler struct {
	profileRepo  models.ProfileRepositoryInterface
	activityRepo models.ActivityRepositoryInterface
}

func NewProfileHandler(profileRepo *models.ProfileRepositoryInterface, activityRep *models.ActivityRepositoryInterface) *ProfileHandler {
	return &ProfileHandler{profileRepo: *profileRepo, activityRepo: *activityRep}
}

// GetProfiles godoc
//
//	@Summary	Get account profiles
//	@Tags		Profile
//	@Security	BearerAuth
//	@Router		/profiles [get]
func (h *ProfileHandler) GetProfiles(c *gin.Context) {
	claims := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims)
	profiles, e := h.profileRepo.FindByAccountID(claims.ID)

	if e != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": e.Error()})
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    profiles,
	})
}

// CreateProfile godoc
//
//	@Summary	Create a new profile
//	@Tags		Profile
//	@Security	BearerAuth
//	@Param		profile	body	types.ProfileDto	true	"Profile dto"
//	@Router		/profiles [post]
func (h *ProfileHandler) CreateProfile(c *gin.Context) {
	claims := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims)

	exe := func() (*models.Profile, error) {
		var dto types.ProfileDto
		if e := c.ShouldBindJSON(&dto); e != nil {
			return nil, e
		}

		p := &models.Profile{
			Name:      dto.Name,
			AccountID: claims.ID,
			BirthYear: dto.BirthYear,
		}
		e := h.profileRepo.Create(p)
		if e != nil {
			return nil, e
		}
		return p, nil
	}

	p, e := exe()
	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    p,
	})
}

// UpdateProfile godoc
//
//	@Summary	Update profile
//	@Tags		Profile
//	@Security	BearerAuth
//	@Param		id		path	int					true	"Profile ID"
//	@Param		profile	body	types.ProfileDto	true	"Profile dto"
//	@Router		/profiles/{id} [put]
func (h *ProfileHandler) UpdateProfile(c *gin.Context) {
	pIdString := c.Param("id")
	claims := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims)

	exe := func() (*models.Profile, error) {
		pId, e := strconv.Atoi(pIdString)
		if e != nil {
			return nil, e
		}

		p, e := h.profileRepo.FindOneById(pId)
		if e != nil {
			return nil, e
		}

		if p.AccountID != claims.ID {
			return nil, errors.New("unauthorized")
		}

		var dto types.ProfileDto
		if e := c.ShouldBindJSON(&dto); e != nil {
			return nil, e
		}

		e = h.profileRepo.Save(&models.Profile{
			ID:        p.ID,
			Name:      dto.Name,
			BirthYear: dto.BirthYear,
		})

		if e != nil {
			return nil, e
		}

		return p, nil
	}

	p, e := exe()
	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    p,
	})
}

// DeleteProfile godoc
//
//	@Summary	Delete profile
//	@Tags		Profile
//	@Security	BearerAuth
//	@Param		id	path	int	true	"Profile ID"
//	@Router		/profiles/{id} [delete]
func (h *ProfileHandler) DeleteProfile(c *gin.Context) {
	pIdString := c.Param("id")
	claims := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims)

	exe := func() error {
		pId, e := strconv.Atoi(pIdString)
		if e != nil {
			return e
		}

		p, e := h.profileRepo.FindOneById(pId)
		if e != nil {
			return e
		}

		if p.AccountID != claims.ID {
			return errors.New("unauthorized")
		}

		return h.profileRepo.Delete(pId)
	}

	e := exe()
	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    pIdString,
	})

}

// GetActivities godoc
//
//	@Summary	Get activities of a profile
//	@Tags		Profile
//	@Security	BearerAuth
//	@Param		id	path	int	true	"Profile ID"
//	@Router		/profiles/{id}/activities [get]
func (h *ProfileHandler) GetActivities(c *gin.Context) {
	profileIdString := c.Param("id")

	exe := func() ([]models.Activity, error) {
		profileId, e := strconv.Atoi(profileIdString)
		if e != nil {
			return nil, e
		}

		as, e := h.activityRepo.FindByProfileID(profileId)
		if e != nil {
			return nil, e
		}

		return as, nil
	}

	as, e := exe()

	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    as,
	})
}

// SaveActivity godoc
//
//	@Summary	Save activity of a profile
//	@Tags		Profile
//	@Security	BearerAuth
//	@Param		id			path	int					true	"Profile ID"
//	@Param		activity	body	types.ActivityDto	true	"Activity dto"
//	@Router		/profiles/{id}/activities [post]
func (h *ProfileHandler) SaveActivity(c *gin.Context) {
	profileIdString := c.Param("id")

	exe := func() error {
		profileId, e := strconv.Atoi(profileIdString)
		if e != nil {
			return e
		}

		var dto types.ActivityDto
		if e := c.ShouldBindJSON(&dto); e != nil {
			return e
		}

		a := &models.Activity{
			LessonName:  dto.LessonName,
			EarnedStars: dto.EarnedStars,
			Result:      dto.Result,
			ProfileID:   profileId,
		}

		return h.activityRepo.Create(a)
	}

	e := exe()
	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Message: "Activity saved successfully",
	})
}
