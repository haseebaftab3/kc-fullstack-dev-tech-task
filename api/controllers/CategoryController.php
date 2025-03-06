<?php

declare(strict_types=1);
require_once __DIR__ . '/../models/Category.php';

class CategoryController
{
    public function getAllCategories(): array
    {
        return Category::getAll();
    }

    public function getCategoryById(string $id): array
    {
        $category = Category::getById($id);
        if (!$category) {
            http_response_code(404);
            return ["error" => "Category not found"];
        }
        return $category;
    }
}
