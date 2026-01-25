# Business Lines Module

The `BusinessLineModule` manages the highest level of categorization in the organization.

## Concept

A **Business Line** represents a major division of the organization, such as "Information Technology", "Human Resources", or "Finance".
It allows the application to be multi-tenant or multi-department at a logical level, separating data and groups by their functional area.

## Entity

| Field    | Type    | Description                                    |
| :------- | :------ | :--------------------------------------------- |
| `key`    | string  | Unique slug (e.g., `it`, `hr`).                |
| `name`   | string  | Display name (e.g., "Information Technology"). |
| `active` | boolean | Whether this line is currently in use.         |

## Usage

- **Groups**: Every Group belongs to a Business Line.
- **Filtering**: APIs often allow filtering by Business Line to show relevant data to managers (e.g., "Show tickets for HR").

## API Overview

| Method  | Path                         | Description                 |
| :------ | :--------------------------- | :-------------------------- |
| `GET`   | `/api/v1/business-lines`     | List all business lines.    |
| `POST`  | `/api/v1/business-lines`     | Create a new business line. |
| `PATCH` | `/api/v1/business-lines/:id` | Update details.             |
