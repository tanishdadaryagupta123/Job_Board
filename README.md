# Job Board Application

## Overview
The Job Board Application is a web platform designed to connect job seekers with potential employers. It allows users to search, filter, and apply for job listings from various sources. The application consists of a backend built with Node.js and Express, and a frontend developed using React.

## Challenges Faced
- **Data Scraping**: Efficiently scraping job listings from multiple sources while handling changes in their HTML structure.
- **CORS Issues**: Managing Cross-Origin Resource Sharing (CORS) to allow frontend and backend communication.
- **Database Management**: Ensuring data consistency and performance while handling a large number of job listings.
- **User Experience**: Creating an intuitive interface that allows users to easily search and filter job listings.

## Implementations
The application includes several key features:
- **Job Listings**: Users can view job listings fetched from various sources.
- **Search Functionality**: Users can search for jobs by title, company, or keywords.
- **Filtering Options**: Users can filter job listings based on location and experience level.
- **Application Process**: Users can apply for jobs directly through the platform.

## Methods Used
- **Web Scraping**: Utilizes libraries like Axios and Cheerio to scrape job listings from external websites.
- **RESTful API**: The backend exposes a RESTful API for the frontend to interact with job listings.
- **Pagination**: Implemented pagination to manage large datasets and improve performance.
- **Error Handling**: Comprehensive error handling for API requests and database operations.

## Languages Used
- **JavaScript**: The primary language for both frontend and backend development.
- **HTML/CSS**: Used for structuring and styling the frontend components.
- **JSON**: For data interchange between the frontend and backend.

## Filter System
The application features a robust filter system that allows users to refine their job search based on:
- **Location**: Users can filter jobs by specific locations (e.g., Remote, Hybrid, On-site).
- **Experience Level**: Users can filter jobs based on required experience levels (e.g., Entry Level, Mid Level, Senior Level).

## Installation
To set up the project locally, follow these steps:

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your environment variables (e.g., MongoDB URI).
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm start
   ```

## Usage
Once both the backend and frontend are running, navigate to `http://localhost:3000` in your web browser to access the Job Board Application.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.


Step1:-
![Screenshot 2025-03-14 231704](https://github.com/user-attachments/assets/2d7a5642-8050-4a9d-a681-6c3d94094f6d)

Step2:-
![Screenshot 2025-03-14 231724](https://github.com/user-attachments/assets/1c4ca6e3-dfe6-442b-b5d1-c73509d69cf4)

Step3:-
![Screenshot 2025-03-14 231738](https://github.com/user-attachments/assets/670ed902-b1eb-4392-a52f-fb79702ec995)

Step4:-
![image](https://github.com/user-attachments/assets/4f5ee571-7479-40ae-b445-dad6c7ecef56)
