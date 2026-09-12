-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "rut" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcionCorta" TEXT NOT NULL,
    "descripcionLarga" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "precioNeto" INTEGER NOT NULL,
    "precioVenta" INTEGER NOT NULL,
    "stockActual" INTEGER NOT NULL,
    "stockMinimo" INTEGER NOT NULL,
    "stockBajo" INTEGER NOT NULL,
    "stockAlto" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "rutEmpresa" TEXT NOT NULL,
    "rubro" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "nombreContacto" TEXT NOT NULL,
    "emailContacto" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_rut_key" ON "Usuario"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_sku_key" ON "Producto"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_rutEmpresa_key" ON "Cliente"("rutEmpresa");
