<?php

declare(strict_types=1);
require_once __DIR__ . '/controllers/CategoryController.php';
require_once __DIR__ . '/controllers/CourseController.php';

$requestUri = explode('?', $_SERVER['REQUEST_URI'])[0];
$requestMethod = $_SERVER['REQUEST_METHOD'];

$routes = [
    'GET' => [
        // More specific routes first
        '/categories/' => ['CategoryController', 'getCategoryById'],
        '/courses/'    => ['CourseController', 'getCourseById'],
        // Then the general routes
        '/categories'  => ['CategoryController', 'getAllCategories'],
        '/courses'     => ['CourseController', 'getAllCourses'],
    ]
];

foreach ($routes[$requestMethod] ?? [] as $route => $handler) {
    if (strpos($requestUri, $route) === 0) {
        $param = trim(str_replace($route, '', $requestUri), '/');
        $controller = new $handler[0]();
        echo json_encode($controller->{$handler[1]}($param));
        exit;
    }
}

http_response_code(404);
echo json_encode(["error" => "Route not found"]);
