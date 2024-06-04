package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TodoItem struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Title       string             `bson:"title"`
	Description string             `bson:"description"`
	Completed   bool               `bson:"completed"`
}

type Service interface {
	Health() map[string]string
	CreateTodo(todo TodoItem) (*TodoItem, error)
	GetTodos() ([]TodoItem, error)
	UpdateTodo(id primitive.ObjectID, update bson.M) (*TodoItem, error)
	DeleteTodo(id primitive.ObjectID) (*TodoItem, error)
}

type service struct {
	db *mongo.Client
	collection *mongo.Collection
}

var (
	// host = os.Getenv("DB_HOST")
	// port = os.Getenv("DB_PORT")
	MONGODB_URI = os.Getenv("MONGODB_URI")
	collectionName = os.Getenv("COLLECTION_NAME")
)

func New() Service {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(MONGODB_URI))
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)

	}
	// defer client.Disconnect(context.Background())
	
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	collection := client.Database("gotodo_db").Collection(collectionName)


	fmt.Println("Connected to MONGODB ATLAS")
	
	return &service{
		db: client,
		collection: collection,
	}
}

func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	err := s.db.Ping(ctx, nil)
	if err != nil {
		log.Fatalf(fmt.Sprintf("db down: %v", err))
	}

	return map[string]string{
		"message": "It's healthy",
	}
}

func (s *service) CreateTodo(todo TodoItem) (*TodoItem, error) {
	_, err := s.collection.InsertOne(context.Background(), todo)
	if err != nil {
		log.Printf("Failed to insert todo: %v", err)
		return nil, err
	}
	return &todo, nil
}

func (s *service) GetTodos() ([]TodoItem, error) {
	cursor, err := s.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var todos []TodoItem
	if err := cursor.All(context.Background(), &todos); err != nil {
		return nil, err
	}

	return todos, nil
}

func (s *service) UpdateTodo(id primitive.ObjectID, update bson.M) (*TodoItem, error) {
	_, err := s.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	if err != nil {
		return nil, err
	}

	var updatedTodo TodoItem
    err = s.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&updatedTodo)
    if err != nil {
        return nil, err
    }

    return &updatedTodo, nil
}

func (s *service) DeleteTodo(id primitive.ObjectID) (*TodoItem, error) {
	// collection := s.db.Database(MONGODB_URI).Collection(collectionName)

	var deletedTodo TodoItem
	err := s.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&deletedTodo)
	if err != nil {
        return nil, err
    }

	_, err = s.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	if err != nil {
        return nil, err
    }
	
	return &deletedTodo, err
}