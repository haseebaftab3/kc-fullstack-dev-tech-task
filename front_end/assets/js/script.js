document.addEventListener('DOMContentLoaded', function () {
  const API_URL = 'http://api.cc.localhost/categories';
  const COURSES_API_URL = 'http://api.cc.localhost/courses';
  const categoryList = document.getElementById('category-list');
  const courseGrid = document.querySelector('.course-grid');

  let categories = [];
  let courses = [];

  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      categories = data;
      fetchCourses();
    })
    .catch(error => console.error('Error fetching categories:', error));

  // Fetch courses from API
  function fetchCourses() {
    fetch(COURSES_API_URL)
      .then(response => response.json())
      .then(data => {
        courses = data;
        const categoryTree = buildCategoryTree(categories);
        categoryList.appendChild(categoryTree);
        displayCourses(courses); // Show all courses by default
      })
      .catch(error => console.error('Error fetching courses:', error));
  }

  function buildCategoryTree(categories) {
    let categoryMap = {};

    // Build a lookup with an added children array
    categories.forEach(category => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    let rootCategories = [];

    // Build hierarchical structure based on parent_id
    categories.forEach(category => {
      if (category.parent_id) {
        if (categoryMap[category.parent_id]) {
          categoryMap[category.parent_id].children.push(
            categoryMap[category.id],
          );
        }
      } else {
        rootCategories.push(categoryMap[category.id]);
      }
    });

    return createCategoryList(rootCategories);
  }

  function createCategoryList(categories) {
    const ul = document.createElement('ul');

    categories.forEach(category => {
      const totalCourses = countCoursesInCategory(category.id);

      const li = document.createElement('li');
      li.innerHTML = `${category.name} ${
        totalCourses > 0
          ? `<span class="course-count">(${totalCourses})</span>`
          : ''
      }`;
      li.classList.add('category-item');
      li.dataset.categoryId = category.id;

      if (category.children.length > 0) {
        li.appendChild(createCategoryList(category.children));
      }

      li.addEventListener('click', function (event) {
        event.stopPropagation();
        filterCoursesByCategory(category.id);
        updateActiveCategory(li);
      });

      ul.appendChild(li);
    });

    return ul;
  }

  function countCoursesInCategory(categoryId) {
    let courseCount = courses.filter(
      course => course.category_id === categoryId,
    ).length;
    const childCategories = getChildCategories(categoryId);
    childCategories.forEach(childId => {
      courseCount += courses.filter(
        course => course.category_id === childId,
      ).length;
    });
    return courseCount;
  }

  function getChildCategories(parentId) {
    let childIds = categories
      .filter(cat => cat.parent_id === parentId)
      .map(cat => cat.id);
    childIds.forEach(id => {
      childIds = childIds.concat(getChildCategories(id));
    });
    return childIds;
  }

  // Display courses
  function displayCourses(courseList) {
    courseGrid.innerHTML = ''; // Clear previous courses
    courseList.forEach(course => {
      const courseCard = createCourseCard(course);
      courseGrid.appendChild(courseCard);
    });
  }

  // Filter courses by category
  function filterCoursesByCategory(categoryId) {
    const filteredCourses = courses.filter(course => {
      return (
        course.category_id === categoryId ||
        getChildCategories(categoryId).includes(course.category_id)
      );
    });
    displayCourses(filteredCourses);
  }

  // Update the active category styling
  function updateActiveCategory(selectedLi) {
    document
      .querySelectorAll('.category-item')
      .forEach(li => li.classList.remove('active'));
    selectedLi.classList.add('active');
  }

  // Create a course card
  function createCourseCard(course) {
    const card = document.createElement('div');
    card.classList.add('card');

    const categoryName =
      categories.find(cat => cat.id === course.category_id)?.name || 'General';

    card.innerHTML = `
          <div class="card-head">
              <div class="course-image">
                  <div class="badge">${categoryName}</div>
                  <img src="${course.preview}" alt="Course Image">
              </div>
          </div>
          <div class="card-body">
              <h1 class="course-title">${course.name}</h1>
              <p class="course-description">${course.description}</p>
          </div>
        `;

    return card;
  }
});
