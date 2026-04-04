using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialSqlServer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bingo_challenges",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    display_order = table.Column<int>(type: "int", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bingo_challenges", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "feature_flags",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    key = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    display_name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    is_manually_enabled = table.Column<bool>(type: "bit", nullable: false),
                    is_manually_disabled = table.Column<bool>(type: "bit", nullable: false),
                    available_from = table.Column<DateTime>(type: "datetime2", nullable: true),
                    available_until = table.Column<DateTime>(type: "datetime2", nullable: true),
                    roles_allowed = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_feature_flags", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "guests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    full_name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    normalized_name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    side = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    is_child = table.Column<bool>(type: "bit", nullable: false),
                    age_at_wedding = table.Column<int>(type: "int", nullable: true),
                    alcohol_default = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    guest_type = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    category = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    is_confirmed = table.Column<bool>(type: "bit", nullable: false),
                    email = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    invitation_token = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    invitation_sent_at = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_guests", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "love_story_events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    event_date = table.Column<DateOnly>(type: "date", nullable: false),
                    title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    photo_url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    display_order = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_love_story_events", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "menu_sections",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    display_order = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_menu_sections", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "schedule_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    time_label = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    time_minutes = table.Column<int>(type: "int", nullable: false),
                    title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    icon = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    display_order = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_schedule_items", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "static_content",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    key = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    metadata = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_static_content", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "guest_bingo_progress",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    guest_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    challenge_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    photo_url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    completed_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_guest_bingo_progress", x => x.id);
                    table.ForeignKey(
                        name: "FK_guest_bingo_progress_bingo_challenges_challenge_id",
                        column: x => x.challenge_id,
                        principalTable: "bingo_challenges",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_guest_bingo_progress_guests_guest_id",
                        column: x => x.guest_id,
                        principalTable: "guests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "guest_photos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    guest_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    file_name = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    file_size_bytes = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_guest_photos", x => x.id);
                    table.ForeignKey(
                        name: "FK_guest_photos_guests_guest_id",
                        column: x => x.guest_id,
                        principalTable: "guests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "questionnaire_responses",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    guest_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    alcohol_preference = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    has_allergy = table.Column<bool>(type: "bit", nullable: false),
                    allergy_notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    submitted_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                name: "seating_assignments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    guest_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    table_number = table.Column<int>(type: "int", nullable: false),
                    table_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    seat_note = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seating_assignments", x => x.id);
                    table.ForeignKey(
                        name: "FK_seating_assignments_guests_guest_id",
                        column: x => x.guest_id,
                        principalTable: "guests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "song_requests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    guest_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    song_name = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    artist = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    dedication = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    guest_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    photo_url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    section_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    display_order = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                name: "idx_bingo_progress_guest_challenge",
                table: "guest_bingo_progress",
                columns: new[] { "guest_id", "challenge_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_guest_bingo_progress_challenge_id",
                table: "guest_bingo_progress",
                column: "challenge_id");

            migrationBuilder.CreateIndex(
                name: "idx_guest_photos_created_at",
                table: "guest_photos",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_guest_photos_guest_id",
                table: "guest_photos",
                column: "guest_id");

            migrationBuilder.CreateIndex(
                name: "idx_guests_invitation_token",
                table: "guests",
                column: "invitation_token",
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
                name: "idx_seating_guest_id",
                table: "seating_assignments",
                column: "guest_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_seating_table_number",
                table: "seating_assignments",
                column: "table_number");

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
                name: "feature_flags");

            migrationBuilder.DropTable(
                name: "guest_bingo_progress");

            migrationBuilder.DropTable(
                name: "guest_photos");

            migrationBuilder.DropTable(
                name: "love_story_events");

            migrationBuilder.DropTable(
                name: "menu_items");

            migrationBuilder.DropTable(
                name: "questionnaire_responses");

            migrationBuilder.DropTable(
                name: "schedule_items");

            migrationBuilder.DropTable(
                name: "seating_assignments");

            migrationBuilder.DropTable(
                name: "song_requests");

            migrationBuilder.DropTable(
                name: "static_content");

            migrationBuilder.DropTable(
                name: "thank_you_messages");

            migrationBuilder.DropTable(
                name: "bingo_challenges");

            migrationBuilder.DropTable(
                name: "menu_sections");

            migrationBuilder.DropTable(
                name: "guests");
        }
    }
}
