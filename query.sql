CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plate_number TEXT NOT NULL UNIQUE,
    car_model TEXT NOT NULL,
    color TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parking_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    ratings_sum INTEGER DEFAULT 0,
    ratings_count INTEGER DEFAULT 0,
    display_price_per_hour NUMERIC(10,2) NOT NULL,
    geom GEOGRAPHY(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parking_locations_geom
ON parking_locations
USING GIST (geom);

CREATE TABLE parking_spots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES parking_locations(id) ON DELETE CASCADE,
    price_per_hour NUMERIC(10,2) NOT NULL,
    total_slots INTEGER NOT NULL,
    available_slots INTEGER NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    spot_id UUID NOT NULL REFERENCES parking_spots(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'RESERVED'
        CHECK (status IN ('RESERVED','ACTIVE','COMPLETED','PAID','CANCELLED','EXPIRED')),
    qr_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL
        CHECK (status IN ('PENDING','SUCCESS','FAILED')),
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) NOT NULL,
    status TEXT NOT NULL DEFAULT('ACTIVE')
        CHECK (status IN ('ACTIVE', 'FROZEN')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)

CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    type TEXT NOT NULL
        CHECK (type IN ('TOPUP', 'RESERVATION_HOLD', 'RESERVATION_CHARGE', 'REFUND', 'PAYMENT', 'ADJUSTMENT')),
    amount DECIMAL(12, 2) NOT NULL,
    status TEXT NOT NULL
        CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED')),
    reference_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ DEFAULT NOW()
)

CREATE TABLE reservation_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    wallet_transaction_id UUID REFERENCES wallet_transactions(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
)

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_spot_id ON reservations(spot_id);
