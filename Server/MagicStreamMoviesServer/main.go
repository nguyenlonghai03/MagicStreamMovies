package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/nguyenlonghai03/MagicStreamMovies/Server/MagicStreamMoviesServer/database"
	"github.com/nguyenlonghai03/MagicStreamMovies/Server/MagicStreamMoviesServer/routes"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func main() {
	// fmt.Println("Hello, MagicStreamMoviesServer!")

	router := gin.Default()

	router.GET("/hello", func(c *gin.Context) {
		c.String(200, "Hello, MagicStreamMoviesServer!")
	})

	var client *mongo.Client = database.Connect()

	routes.SetupUnProtectedRoutes(router, client)
	routes.SetupProtectedRoutes(router, client)

	if err := router.Run(":8080"); err != nil {
		fmt.Println("Failed to start server:", err)
	}

	// router.Run(":8080")
}
