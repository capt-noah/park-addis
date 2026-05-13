# Reservations Data Guide (Enriched View)

This document explains how to fetch reservation data from the ParkAddis backend. The system-wide reservation endpoint is designed to return not just the reservation details, but also the identity of the driver and the specific vehicle being used.

---

## 1. Global Reservation Fetch (Admin)

The primary endpoint for retrieving reservations is located under the admin routes. This endpoint performs complex joins across the `users`, `vehicles`, `parking_spots`, and `parking_locations` tables.

### Get All Reservations
**`GET /api/admin/reservations`**

- **Authentication:** Required (Admin Role).
- **Query Parameters:**
  - `status` (Optional): Filter by status (e.g., `ACTIVE`, `RESERVED`, `COMPLETED`, `CANCELLED`).

#### Success Response (200 OK)
Returns an array of enriched reservation objects.

```json
[
  {
    "id": "res-uuid-123",
    "userId": "user-uuid-456",
    "userFullName": "Abebe Bekele",
    "vehicleId": "vehicle-uuid-789",
    "vehicleType": "Toyota Corolla",
    "vehiclePlate": "AA-B12345",
    "startTime": "2026-05-13T10:00:00Z",
    "endTime": "2026-05-13T12:00:00Z",
    "status": "ACTIVE",
    "locationName": "Bole International Mall",
    "processedByEmployeeName": "Clerk Abebe",
    "createdAt": "2026-05-13T09:45:00Z"
  }
]
```

---

## 2. Key Data Mappings

The following table explains where each field in the response comes from:

| Field Name | Origin Table | Description |
| :--- | :--- | :--- |
| `id` | `reservations` | Unique ID of the reservation session. |
| `userId` | `reservations` | Foreign key link to the driver. |
| `userFullName` | `users` | The legal name of the driver (Joined from `users`). |
| `vehicleId` | `reservations` | Foreign key link to the vehicle. |
| `vehicleType` | `vehicles` | The car model/make (Joined from `vehicles`). |
| `vehiclePlate` | `vehicles` | The license plate number (Joined from `vehicles`). |
| `locationName` | `parking_locations` | The name of the parking lot (Joined via `parking_spots`). |
| `processedByEmployeeName` | `employees` | The name of the clerk who processed the entry/exit. |
| `status` | `reservations` | Current state: `RESERVED`, `ACTIVE`, `COMPLETED`, etc. |

---

## 3. Implementation Details (Backend)

The backend uses a `leftJoin` strategy to ensure that even if a user or vehicle record is missing/archived, the reservation record still appears in the dashboard results.

**SQL Logic Summary:**
1. Select from `reservations`.
2. Join `users` on `reservations.user_id`.
3. Join `vehicles` on `reservations.vehicle_id`.
4. Join `parking_spots` on `reservations.spot_id`.
5. Join `parking_locations` on `parking_spots.location_id`.
6. Order by `created_at` descending.

---

## 4. Frontend Usage Tip

When rendering this in a table (e.g., `DashboardView.tsx`), you can use the `userFullName` and `vehiclePlate` fields directly to build a highly informative live feed without having to make secondary API calls for each row.

Example React Column:
```tsx
const columns = [
  { header: 'Driver', accessor: 'userFullName' },
  { header: 'Plate', accessor: 'vehiclePlate' },
  { header: 'Vehicle', accessor: 'vehicleType' },
  { header: 'Location', accessor: 'locationName' },
  { header: 'Status', accessor: 'status' }
];
```
