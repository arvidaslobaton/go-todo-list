package main

import (
	"backend/internal/server"
	"fmt"
	"os"
)

func main() {

	port := os.Getenv("PORT")

	server := server.NewServer()

	fmt.Printf("Starting server at port %v", port)

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
