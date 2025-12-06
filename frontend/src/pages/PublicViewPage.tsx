import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface FileType {
  _id: string;
  name: string;
  url?: string;
}

interface FolderType {
  _id: string;
  name: string;
  files?: FileType[];
  children?: FolderType[];
}

export default function PublicViewPage() {
  const { shareId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/public/${shareId}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [shareId]);

  if (loading) return <h2>Loading…</h2>;
  if (!data) return <h2 style={{ color: "red" }}>Invalid or expired link</h2>;

  // Detect if it's a file or folder
  const isFile = data.url || data.type === "file";

  return (
    <div style={{ padding: "40px" }}>
      <h1>{isFile ? "Shared File" : "Shared Folder"}</h1>

      {isFile && (
        <div>
          <p><strong>File Name:</strong> {data.name}</p>
          {data.url && (
            <a href={data.url} target="_blank" rel="noreferrer">
              Download File
            </a>
          )}
        </div>
      )}

      {!isFile && (
        <div>
          <p><strong>Folder Name:</strong> {data.name}</p>

          <h3>Files:</h3>
          {data.files?.length ? (
            data.files.map((file: FileType) => (
              <div key={file._id}>
                {file.name}{" "}
                {file.url && (
                  <a href={file.url} target="_blank">
                    Download
                  </a>
                )}
              </div>
            ))
          ) : (
            <p>No files</p>
          )}

          <h3>Sub Folders:</h3>
          {data.children?.length ? (
            data.children.map((folder: FolderType) => (
              <div key={folder._id}>{folder.name}</div>
            ))
          ) : (
            <p>No subfolders</p>
          )}
        </div>
      )}
    </div>
  );
}
