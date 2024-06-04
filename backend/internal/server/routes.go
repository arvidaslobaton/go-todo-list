package server

import (
	"backend/internal/database"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/", s.HelloWorldHandler)

	r.HandleFunc("/health", s.healthHandler)

	r.HandleFunc("/todos", s.createTodo).Methods("POST")

	r.HandleFunc("/todos", s.getTodos).Methods("GET")

	r.HandleFunc("/todos/{id}", s.updateTodo).Methods("PUT")

	r.HandleFunc("/todos/{id}", s.deleteTodo).Methods("DELETE")

	return r
}

func (s *Server) HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, err := json.Marshal(s.db.Health())

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) createTodo(w http.ResponseWriter, r *http.Request) {
	var todo database.TodoItem
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		log.Printf("Error decoding request body: %v", err)
		return
	}
	defer r.Body.Close()

	createdTodo, err := s.db.CreateTodo(todo); 
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		log.Printf("Error creating todo: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(createdTodo)
}

func (s *Server) getTodos(w http.ResponseWriter, r *http.Request) {
	todos, err := s.db.GetTodos()
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		log.Printf("Error retrieving todo list: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func (s *Server) updateTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "invalid ID", http.StatusBadRequest)
		log.Printf("Error converting ID: %v", err)
		return
	}

	var parseData primitive.M;
	if err := json.NewDecoder(r.Body).Decode(&parseData); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		log.Printf("Error decoding request body: %v", err)
		return
	}

	update := bson.M{"$set": parseData}

	updatedTodo, err := s.db.UpdateTodo(objectID, update)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		log.Printf("Error updating todo list: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedTodo)

}

func (s *Server) deleteTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "invalid ID", http.StatusBadRequest)
		log.Printf("Error converting ID: %v", err)
		return
	}

	deletedTodo, err := s.db.DeleteTodo(objectID)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		log.Printf("Error updating todo list: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(deletedTodo)

}