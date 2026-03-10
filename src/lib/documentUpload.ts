import { supabase } from "@/integrations/supabase/client";

// ---------- Types ----------

export type UploadDocumentInput = {
  caseId: string;
  documentTypeId: string;
  file: File;
};

export type UploadDocumentResult = {
  documentId: string;
  storageBucket: string;
  storagePath: string;
  originalFileName: string;
  uploadStatus: string;
};

type InitResponse = {
  document_id: string;
  storage_bucket: string;
  storage_path: string;
  original_file_name: string;
  upload_status: string;
};

type ConfirmResponse = {
  id: string;
  upload_status: string;
  uploaded_at: string | null;
};

// ---------- Helper ----------

export async function uploadCaseDocument(
  input: UploadDocumentInput
): Promise<UploadDocumentResult> {
  const { caseId, documentTypeId, file } = input;

  if (!caseId) throw new Error("Hiányzó ügy azonosító (case_id).");
  if (!documentTypeId) throw new Error("Hiányzó dokumentumtípus azonosító (document_type_id).");
  if (!file) throw new Error("Nincs kiválasztott fájl.");

  // 1. Init – create document record
  const { data: initRaw, error: initError } = await supabase.functions.invoke(
    "upload-document-init",
    {
      body: {
        case_id: caseId,
        document_type_id: documentTypeId,
        file_name: file.name,
        mime_type: file.type || "application/octet-stream",
        file_size_bytes: file.size,
      },
    }
  );

  if (initError) {
    throw new Error(`Dokumentum előkészítése sikertelen: ${initError.message}`);
  }

  const initData = initRaw as InitResponse | null;

  if (
    !initData?.document_id ||
    !initData?.storage_bucket ||
    !initData?.storage_path
  ) {
    throw new Error(
      "A szerver nem adott vissza érvényes dokumentum adatokat az előkészítés során."
    );
  }

  // 2. Upload file to Storage
  const { error: storageError } = await supabase.storage
    .from(initData.storage_bucket)
    .upload(initData.storage_path, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

  if (storageError) {
    throw new Error(`Fájl feltöltése sikertelen: ${storageError.message}`);
  }

  // 3. Confirm upload
  const { data: confirmRaw, error: confirmError } =
    await supabase.functions.invoke("confirm-document-upload", {
      body: { document_id: initData.document_id },
    });

  if (confirmError) {
    throw new Error(
      `Feltöltés megerősítése sikertelen: ${confirmError.message}`
    );
  }

  const confirmData = confirmRaw as ConfirmResponse | null;

  if (!confirmData?.id || !confirmData?.upload_status) {
    throw new Error(
      "A szerver nem adott vissza érvényes megerősítési adatokat."
    );
  }

  // 4. Return normalized result
  return {
    documentId: initData.document_id,
    storageBucket: initData.storage_bucket,
    storagePath: initData.storage_path,
    originalFileName: initData.original_file_name,
    uploadStatus: confirmData.upload_status,
  };
}
