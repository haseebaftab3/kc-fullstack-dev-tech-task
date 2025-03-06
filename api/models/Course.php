<?php

declare(strict_types=1);
require_once __DIR__ . '/../Database.php';

class Course
{
    public static function getAll(?string $categoryId = null): array
    {
        $db = Database::getConnection();
        if ($categoryId) {
            $stmt = $db->prepare("SELECT * FROM course_list WHERE category_id = ?");
            $stmt->execute([$categoryId]);
        } else {
            $stmt = $db->query("SELECT * FROM course_list");
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getById(string $id): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM course_list WHERE course_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}
