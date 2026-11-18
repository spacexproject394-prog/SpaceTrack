"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Logo from "@/components/Logo";

export default function RegisterImplantPage() {
  const [form, setForm] = useState({
    serialNumber: "",
    qrCode: null,
    petName: "",
    petBreed: "",
    vetContact: "",
    chipRegistration: "",
    chipRegistrationDate: "",
    chipRegistrationLocation: "",
    petPhoto: null,
  });
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQrFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, qrCode: { name: file.name, data: reader.result } }));
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Pet photo must be a PNG, JPG, or WebP image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, petPhoto: { name: file.name, data: reader.result } }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasSerial = form.serialNumber.trim().length > 0;
    const hasQr = Boolean(form.qrCode);
    const hasChip = form.chipRegistration.trim().length > 0;
    const hasChipDate = form.chipRegistrationDate.trim().length > 0;
    const hasChipLocation = form.chipRegistrationLocation.trim().length > 0;

    if (!hasSerial && !hasQr) {
      setError("Please enter a serial number or attach a QR code photo");
      return;
    }
    if (!hasChip || !hasChipDate || !hasChipLocation) {
      setError("Chip registration number, date, and location are required (mandatory for the pet passport).");
      return;
    }

    setError("");
    try {
      const res = await fetch("/api/implants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serial: form.serialNumber || null,
          petName: form.petName,
          breed: form.petBreed,
          vetContact: form.vetContact,
          chipRegistration: form.chipRegistration,
          chipRegistrationDate: form.chipRegistrationDate,
          chipRegistrationLocation: form.chipRegistrationLocation,
          photo: form.petPhoto?.data ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }
      alert(`Implant registered for ${form.petName}! A pet profile has been created.`);
    } catch {
      setError("Network error — please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <Logo size={40} />
        </div>
        <h2 className="mb-6 text-2xl font-bold">Register Implant</h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="serialNumber" className="mb-1 block text-sm font-medium">
              Serial number (if available)
            </label>
            <input
              id="serialNumber"
              type="text"
              name="serialNumber"
              value={form.serialNumber}
              onChange={handleChange}
              placeholder="ST-12345-ABCD"
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="chipRegistration" className="mb-1 block text-sm font-medium">
              Chip registration number *
            </label>
            <input
              id="chipRegistration"
              type="text"
              name="chipRegistration"
              value={form.chipRegistration}
              onChange={handleChange}
              placeholder="DE-123456789"
              required
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted">
              Mandatory chip registration number for the pet passport (e.g., Tasso/
              Findefix registry).
            </p>
          </div>

          <div>
            <label htmlFor="chipRegistrationDate" className="mb-1 block text-sm font-medium">
              Date of first read / implanted *
            </label>
            <input
              id="chipRegistrationDate"
              type="date"
              name="chipRegistrationDate"
              value={form.chipRegistrationDate}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted">
              Date the microchip was inserted or first read (pet passport field).
            </p>
          </div>

          <div>
            <label htmlFor="chipRegistrationLocation" className="mb-1 block text-sm font-medium">
              Location of the microchip *
            </label>
            <input
              id="chipRegistrationLocation"
              type="text"
              name="chipRegistrationLocation"
              value={form.chipRegistrationLocation}
              onChange={handleChange}
              placeholder="e.g., Left shoulder strap"
              required
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted">
              Where on the animal the microchip is located (pet passport field).
            </p>
          </div>

          <div>
            <span className="mb-1 block text-sm font-medium">QR code</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border-2 border-dashed border-border px-4 py-6 text-center transition-colors hover:bg-slate-50"
            >
              <svg
                className="mx-auto mb-2 h-8 w-8 text-muted"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2z" />
              </svg>
              <span className="text-sm text-muted">
                {form.qrCode ? form.qrCode.name : "Upload a photo of the QR code"}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleQrFile}
              className="hidden"
            />
            <p className="mt-1 text-xs text-muted">JPG, PNG or WebP</p>
          </div>

          <div>
            <span className="mb-1 block text-sm font-medium">Pet photo</span>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-full rounded-lg border-2 border-dashed border-border px-4 py-6 text-center transition-colors hover:bg-slate-50"
            >
              <svg
                className="mx-auto mb-2 h-8 w-8 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-sm text-muted">
                {form.petPhoto ? form.petPhoto.name : "Upload a photo of your pet"}
              </span>
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoFile}
              className="hidden"
            />
            <p className="mt-1 text-xs text-muted">
              Optional personal photo of your pet (PNG, JPG or WebP).
            </p>
          </div>

          <div>
            <label htmlFor="petName" className="mb-1 block text-sm font-medium">
              Pet name
            </label>
            <input
              id="petName"
              type="text"
              name="petName"
              value={form.petName}
              onChange={handleChange}
              placeholder="Whiskers"
              required
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="petBreed" className="mb-1 block text-sm font-medium">
              Breed
            </label>
            <input
              id="petBreed"
              type="text"
              name="petBreed"
              value={form.petBreed}
              onChange={handleChange}
              placeholder="e.g., Domestic Shorthair, Siamese, Maine Coon"
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="vetContact" className="mb-1 block text-sm font-medium">
              Vet contact
            </label>
            <input
              id="vetContact"
              type="text"
              name="vetContact"
              value={form.vetContact}
              onChange={handleChange}
              placeholder="Clinic name and phone"
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark"
          >
            Register Implant
          </button>

          <p className="mt-4 text-center text-sm text-muted">
            <Link href="/auth/log-in" className="text-primary underline">
              Back to log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
