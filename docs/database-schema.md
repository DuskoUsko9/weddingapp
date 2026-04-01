# Database Schema — MadU Wedding App

**Engine:** PostgreSQL 16
**Local:** Docker container
**Production:** Azure Database for PostgreSQL Flexible Server
**Naming:** snake_case tables and columns, plural table names

---

## Schema Overview

```
guests
  ├── questionnaire_responses (1:1)
  ├── song_requests (1:N)
  ├── guest_bingo_progress (1:N, Phase 2)
  └── thank_you_messages (1:1, Phase 3)

feature_flags (standalone)
schedule_items (standalone)
menu_items (standalone)
static_content (standalone, key-value)
love_story_events (standalone)
bingo_challenges (standalone)
  └── guest_bingo_progress (N:M bridge, Phase 2)
```

---

## Full DDL

```sql
-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- trigram similarity for name search
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- accent-insensitive Slovak search

-- ============================================================
-- GUESTS
-- ============================================================
CREATE TABLE guests (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name           VARCHAR(200)    NOT NULL,
    normalized_name     VARCHAR(200)    NOT NULL,  -- unaccent + lower, for search
    side                VARCHAR(20)     NOT NULL DEFAULT 'Both',  -- Bride|Groom|Both
    is_child            BOOLEAN         NOT NULL DEFAULT false,
    age_at_wedding      SMALLINT        NULL,
    alcohol_default     VARCHAR(30)     NOT NULL DEFAULT 'Drinks',
    guest_type          VARCHAR(30)     NOT NULL DEFAULT 'Standard', -- Standard|After20
    category            VARCHAR(30)     NOT NULL DEFAULT 'Family',   -- Family|Friends|Colleagues|Supplier
    is_confirmed        BOOLEAN         NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_guests_normalized_name ON guests USING gin(normalized_name gin_trgm_ops);
CREATE INDEX idx_guests_is_confirmed    ON guests(is_confirmed);

-- ============================================================
-- FEATURE FLAGS
-- ============================================================
CREATE TABLE feature_flags (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key                 VARCHAR(100)    NOT NULL UNIQUE,
    display_name        VARCHAR(200)    NOT NULL,
    is_manually_enabled  BOOLEAN        NOT NULL DEFAULT false,
    is_manually_disabled BOOLEAN        NOT NULL DEFAULT false,
    available_from      TIMESTAMPTZ     NULL,   -- UTC auto-unlock
    available_until     TIMESTAMPTZ     NULL,   -- UTC auto-lock
    roles_allowed       TEXT[]          NOT NULL DEFAULT '{}',  -- empty = all roles
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT chk_no_both_overrides CHECK (NOT (is_manually_enabled AND is_manually_disabled))
);

CREATE INDEX idx_feature_flags_key ON feature_flags(key);

-- ============================================================
-- QUESTIONNAIRE RESPONSES
-- ============================================================
CREATE TABLE questionnaire_responses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id            UUID            NOT NULL UNIQUE REFERENCES guests(id) ON DELETE CASCADE,
    alcohol_preference  VARCHAR(30)     NOT NULL,   -- Drinks|WineOnly|BeerOnly|NonDrinker
    has_allergy         BOOLEAN         NOT NULL DEFAULT false,
    allergy_notes       TEXT            NULL,        -- max 500 chars enforced in app
    submitted_at        TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- ============================================================
-- SONG REQUESTS
-- ============================================================
CREATE TABLE song_requests (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id            UUID            NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    song_name           VARCHAR(300)    NOT NULL,
    artist              VARCHAR(300)    NULL,
    dedication          VARCHAR(120)    NULL,   -- max 120 chars (enforced in app + DB)
    status              VARCHAR(20)     NOT NULL DEFAULT 'Pending',  -- Pending|Played|Skipped
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_song_requests_status     ON song_requests(status);
CREATE INDEX idx_song_requests_guest_id   ON song_requests(guest_id);
CREATE INDEX idx_song_requests_created_at ON song_requests(created_at DESC);

-- ============================================================
-- SCHEDULE ITEMS
-- ============================================================
CREATE TABLE schedule_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_label          VARCHAR(10)     NOT NULL,   -- "15:30" (display)
    time_minutes        SMALLINT        NOT NULL,   -- 930 (15*60+30), for sorting
    title               VARCHAR(300)    NOT NULL,
    description         TEXT            NULL,
    icon                VARCHAR(10)     NULL,       -- emoji or icon name
    display_order       SMALLINT        NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_schedule_items_order ON schedule_items(display_order, time_minutes);

-- ============================================================
-- MENU SECTIONS + ITEMS
-- ============================================================
CREATE TABLE menu_sections (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(200)    NOT NULL,   -- "Predjedlá", "Polievka", etc.
    display_order       SMALLINT        NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE TABLE menu_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id          UUID            NOT NULL REFERENCES menu_sections(id) ON DELETE CASCADE,
    name                VARCHAR(300)    NOT NULL,
    description         TEXT            NULL,
    display_order       SMALLINT        NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_menu_items_section ON menu_items(section_id, display_order);

-- ============================================================
-- STATIC CONTENT (parking, accommodation, etc.)
-- ============================================================
CREATE TABLE static_content (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key                 VARCHAR(100)    NOT NULL UNIQUE,  -- "parking"|"accommodation"
    title               VARCHAR(300)    NOT NULL,
    content             TEXT            NOT NULL,
    metadata            JSONB           NULL,   -- {mapUrl, phone, checkIn, etc.}
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- ============================================================
-- LOVE STORY EVENTS
-- ============================================================
CREATE TABLE love_story_events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_date          DATE            NOT NULL,
    title               VARCHAR(300)    NOT NULL,
    description         TEXT            NULL,
    photo_url           TEXT            NULL,   -- Azure Blob URL (Phase 2)
    display_order       SMALLINT        NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_love_story_date ON love_story_events(event_date);

-- ============================================================
-- BINGO CHALLENGES
-- ============================================================
CREATE TABLE bingo_challenges (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(300)    NOT NULL,
    description         TEXT            NULL,
    display_order       SMALLINT        NOT NULL DEFAULT 0,
    is_active           BOOLEAN         NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- ============================================================
-- GUEST BINGO PROGRESS  (Phase 2)
-- ============================================================
CREATE TABLE guest_bingo_progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id            UUID            NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    challenge_id        UUID            NOT NULL REFERENCES bingo_challenges(id) ON DELETE CASCADE,
    completed_at        TIMESTAMPTZ     NOT NULL DEFAULT now(),
    photo_url           TEXT            NULL,
    UNIQUE(guest_id, challenge_id)
);

CREATE INDEX idx_bingo_progress_guest ON guest_bingo_progress(guest_id);

-- ============================================================
-- THANK YOU MESSAGES  (Phase 3)
-- ============================================================
CREATE TABLE thank_you_messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id            UUID            NOT NULL UNIQUE REFERENCES guests(id) ON DELETE CASCADE,
    message             TEXT            NOT NULL,
    photo_url           TEXT            NULL,   -- Azure Blob URL
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- ============================================================
-- UPDATED_AT AUTO-UPDATE TRIGGER (apply to all tables)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to each table:
CREATE TRIGGER trg_guests_updated_at
    BEFORE UPDATE ON guests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_feature_flags_updated_at
    BEFORE UPDATE ON feature_flags FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_questionnaire_updated_at
    BEFORE UPDATE ON questionnaire_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_song_requests_updated_at
    BEFORE UPDATE ON song_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_schedule_items_updated_at
    BEFORE UPDATE ON schedule_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_menu_sections_updated_at
    BEFORE UPDATE ON menu_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_menu_items_updated_at
    BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_static_content_updated_at
    BEFORE UPDATE ON static_content FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_love_story_updated_at
    BEFORE UPDATE ON love_story_events FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bingo_challenges_updated_at
    BEFORE UPDATE ON bingo_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_thank_you_updated_at
    BEFORE UPDATE ON thank_you_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Seed Data — Feature Flags

```sql
INSERT INTO feature_flags (key, display_name, available_from, available_until, is_manually_enabled) VALUES
-- Always available (manually enabled, no time restriction)
('wedding_info',    'Svadobné info',         NULL,                           NULL,                          true),
('schedule',        'Program',               NULL,                           NULL,                          true),
('menu',            'Menu',                  NULL,                           NULL,                          true),
('parking',         'Parkovanie',            NULL,                           NULL,                          true),
('accommodation',   'Ubytovanie',            NULL,                           NULL,                          true),
('playlist',        'Playlist pre DJ',       NULL,                           NULL,                          true),
('love_story',      'Príbeh lásky',          NULL,                           NULL,                          true),

-- Time-locked features
('questionnaire',   'Dotazník',              '2026-01-01 00:00:00+00',       '2026-08-01 00:00:00+00',      false),
('seating',         'Stolovanie',            '2026-09-04 22:00:00+00',       NULL,                          false),
('photo_upload',    'Nahrávanie fotiek',     '2026-09-04 22:00:00+00',       NULL,                          false),
('photo_bingo',     'Foto Bingo',            '2026-09-04 22:00:00+00',       NULL,                          false),
('gallery',         'Galéria',               '2026-09-06 06:00:00+00',       NULL,                          false),
('thank_you',       'Poďakovanie',           '2026-09-06 06:00:00+00',       NULL,                          false),
('cocktails',       'Kokteily',              NULL,                           NULL,                          false);
-- cocktails: manually disabled until Phase 2 content is ready
```

Note: `2026-09-04 22:00:00 UTC` = `2026-09-05 00:00:00 CEST` (midnight wedding day)
Note: `2026-09-06 06:00:00 UTC` = `2026-09-06 08:00:00 CEST` (gallery unlock)

---

## Static Content Seed

```sql
INSERT INTO static_content (key, title, content, metadata) VALUES
('parking',
 'Parkovanie',
 'Parkovisko sa nachádza priamo pri Penzióne Zemiansky Dvor v Surovciach. Kapacita je dostatočná pre všetkých hostí. Príjazd je možný z hlavnej cesty smerom na Surovce.',
 '{"mapUrl": "https://maps.google.com/?q=Penz%C3%ADon+Zemiansky+Dvor+Surovce", "coordinates": {"lat": 48.5, "lng": 17.8}}'
),
('accommodation',
 'Ubytovanie',
 'Ubytovanie je priamo v Penzióne Zemiansky Dvor. Izby sú k dispozícii po dohovore s organizátormi. Raňajky nie sú zahrnuté v cene ubytovania.',
 '{"phone": null, "checkInDate": "2026-09-05", "note": "Raňajky nie sú v cene"}'
);
```

---

## Local DB — Docker Configuration

```yaml
# docker-compose.yml (excerpt)
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: weddingapp
    POSTGRES_USER: wedding
    POSTGRES_PASSWORD: wedding123
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data

pgadmin:
  image: dpage/pgadmin4:latest
  environment:
    PGADMIN_DEFAULT_EMAIL: admin@wedding.local
    PGADMIN_DEFAULT_PASSWORD: admin123
  ports:
    - "5050:80"
  depends_on:
    - postgres
```

Connection string (local):
```
Host=localhost;Port=5432;Database=weddingapp;Username=wedding;Password=wedding123
```

---

## Production DB — Azure

**Service:** Azure Database for PostgreSQL Flexible Server
**SKU for wedding scale:** Burstable B1ms (1 vCore, 2 GB RAM) — ~$15/month
**Storage:** 32 GB (overkill for 75 guests, but minimum tier)
**Backup:** 7-day automated backup (default)
**TLS:** Required (enforced)
**Firewall:** App Service outbound IP only

Connection string (production, via Azure Key Vault):
```
Host={azure-pg-host}.postgres.database.azure.com;
Port=5432;
Database=weddingapp;
Username=wedding@{server-name};
Password={from-key-vault};
SSL Mode=Require;
```
