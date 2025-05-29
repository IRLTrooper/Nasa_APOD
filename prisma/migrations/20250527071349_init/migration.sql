-- CreateTable
CREATE TABLE "Apod" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,

    CONSTRAINT "Apod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Apod_date_key" ON "Apod"("date");
