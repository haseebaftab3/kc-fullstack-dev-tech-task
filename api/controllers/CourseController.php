<?php

declare(strict_types=1);
require_once __DIR__ . '/../models/Course.php';

class CourseController
{
    public function getAllCourses(): array
    {
        $categoryId = $_GET['category_id'] ?? null;
        return Course::getAll($categoryId);
    }

    public function getCourseById(string $id): array
    {
        $course = Course::getById($id);
        if (!$course) {
            http_response_code(404);
            return ["error" => "Course not found"];
        }
        return $course;
    }
}
