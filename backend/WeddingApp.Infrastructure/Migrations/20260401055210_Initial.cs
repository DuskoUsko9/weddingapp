using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bingo_challenges",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bingo_challenges", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "feature_flags",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    display_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    is_manually_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    is_manually_disabled = table.Column<bool>(type: "boolean", nullable: false),
                    available_from = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    available_until = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    roles_allowed = table.Column<string[]>(type: "text[]", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_feature_flags", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "guests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    full_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    normalized_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    side = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    is_child = table.Column<bool>(type: "boolean", nullable: false),
                    age_at_wedding = table.Column<int>(type: "integer", nullable: true),
                    alcohol_default = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    guest_type = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    category = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    is_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_guests", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "love_story_events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    event_date = table.Column<DateOnly>(type: "date", nullable: false),
                    title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    photo_url = table.Column<string>(type: "text", nullable: true),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_love_story_events", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "menu_sections",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_menu_sections", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "schedule_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    time_label = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    time_minutes = table.Column<int>(type: "integer", nullable: false),
                    title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    icon = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_schedule_items", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "static_content",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    metadata = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_static_content", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "questionnaire_responses",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    guest_id = table.Column<Guid>(type: "uuid", nullable: false),
                    alcohol_preference = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    has_allergy = table.Column<bool>(type: "boolean", nullable: false),
                    allergy_notes = table.Column<string>(type: "text", nullable: true),
                    submitted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_questionnaire_responses", x => x.id);
                    table.ForeignKey(
                        name: "FK_questionnaire_responses_guests_guest_id",
                        column: x => x.guest_id,
                        principalTable: "guests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "song_requests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    guest_id = table.Column<Guid>(type: "uuid", nullable: false),
                    song_name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    artist = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    dedication = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_song_requests", x => x.id);
                    table.ForeignKey(
                        name: "FK_song_requests_guests_guest_id",
                        column: x => x.guest_id,
                        principalTable: "guests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "thank_you_messages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    guest_id = table.Column<Guid>(type: "uuid", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    photo_url = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_thank_you_messages", x => x.id);
                    table.ForeignKey(
                        name: "FK_thank_you_messages_guests_guest_id",
                        column: x => x.guest_id,
                        principalTable: "guests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "menu_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    section_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_menu_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_menu_items_menu_sections_section_id",
                        column: x => x.section_id,
                        principalTable: "menu_sections",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "idx_feature_flags_key",
                table: "feature_flags",
                column: "key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_guests_is_confirmed",
                table: "guests",
                column: "is_confirmed");

            migrationBuilder.CreateIndex(
                name: "idx_guests_normalized_name",
                table: "guests",
                column: "normalized_name");

            migrationBuilder.CreateIndex(
                name: "idx_love_story_date",
                table: "love_story_events",
                column: "event_date");

            migrationBuilder.CreateIndex(
                name: "IX_menu_items_section_id",
                table: "menu_items",
                column: "section_id");

            migrationBuilder.CreateIndex(
                name: "idx_questionnaire_guest_id",
                table: "questionnaire_responses",
                column: "guest_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_song_requests_created_at",
                table: "song_requests",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_song_requests_guest_id",
                table: "song_requests",
                column: "guest_id");

            migrationBuilder.CreateIndex(
                name: "idx_song_requests_status",
                table: "song_requests",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "idx_static_content_key",
                table: "static_content",
                column: "key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_thank_you_guest_id",
                table: "thank_you_messages",
                column: "guest_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bingo_challenges");

            migrationBuilder.DropTable(
                name: "feature_flags");

            migrationBuilder.DropTable(
                name: "love_story_events");

            migrationBuilder.DropTable(
                name: "menu_items");

            migrationBuilder.DropTable(
                name: "questionnaire_responses");

            migrationBuilder.DropTable(
                name: "schedule_items");

            migrationBuilder.DropTable(
                name: "song_requests");

            migrationBuilder.DropTable(
                name: "static_content");

            migrationBuilder.DropTable(
                name: "thank_you_messages");

            migrationBuilder.DropTable(
                name: "menu_sections");

            migrationBuilder.DropTable(
                name: "guests");
        }
    }
}
