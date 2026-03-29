# Database Schema

This document outlines the data model for the ESM Server.

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--|{ Group : "member of"
    User }|--|{ Role : "has assigned"
    User }|--|{ Permission : "has direct"
    User ||--|{ RefreshToken : "owns (loose ref)"

    Group }|--|{ Role : "has assigned"
    Group }|--|{ Permission : "has direct"
    Group }|--|| BusinessLine : "belongs to"
    Group }|--|| User : "led by"

    Role }|--|{ Permission : "contains"
    Role }|--|{ Group : "assigned to"
    Role }|--|{ User : "assigned to"

    %% Entity Definitions

    User {
        uuid id
        string username
        string email
        string displayName
        enum authSource "local, ldap, azure_ad"
        string externalId "AD GUID"
        string password "hashed (local only)"
        boolean isActive
        boolean isLicensed
        json metadata "LDAP attributes"
        datetime lastLoginAt
        datetime createdAt
        datetime updatedAt
    }

    Role {
        uuid id
        string key "unique-slug"
        string name
        string description
        int permissionCount
        int userCount
        datetime createdAt
        datetime updatedAt
    }

    Permission {
        uuid id
        string key "unique-slug"
        string subject "Resource (e.g. Case)"
        string action "Operation (e.g. read)"
        string category
        json conditions "CASL conditions"
        string description
        datetime createdAt
        datetime updatedAt
    }

    Group {
        uuid id
        string name
        enum type "distribution, security, m365"
        string description
        uuid teamLeaderId
        uuid businessLineId
        datetime createdAt
        datetime updatedAt
    }

    BusinessLine {
        uuid id
        string key
        string name
        string description
        boolean active
        datetime createdAt
        datetime updatedAt
    }

    RefreshToken {
        number id
        string userId "No FK constraint"
        string token
        datetime expiresAt
        boolean isRevoked
        datetime createdAt
    }
```

## Data Dictionary

### Identity & Access

| Entity           | Description                                                                                            | Key Fields                            |
| :--------------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------ |
| **User**         | Represents a system user. Can be sourced locally or synced from External Identity Providers (AD/LDAP). | `username`, `authSource`, `metadata` |
| **Role**         | A standard RBAC role that bundles permissions. Can be assigned to Users or Groups.                     | `key`, `name`                         |
| **Permission**   | A granular capability definition consisting of an Action and a Subject.                                | `action`, `subject`, `conditions`     |
| **RefreshToken** | Long-lived tokens used to refresh JWT access tokens.                                                   | `token`, `expiresAt`                 |

### Organization

| Entity           | Description                                                                   | Key Fields     |
| :--------------- | :---------------------------------------------------------------------------- | :------------- |
| **Group**        | Represents a Team or Department. Used for hierarchical permission assignment. | `name`, `type` |
| **BusinessLine** | High-level organizational division (e.g., IT, HR, Finance).                   | `key`, `name`  |

