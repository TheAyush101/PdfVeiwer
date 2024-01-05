import React, { useState, useEffect } from "react";
import "./Pdf.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Pdf() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState(null);
  const [zoom, setZoom] = useState(0.7);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth0(); 

  // Extract the username from the location state
  const username = location.state ? location.state.emailId : "";
  useEffect(() => {
    // Check if the user is authenticated, otherwise redirect to login
    if (!username) {
      navigate("/login");
    }
  }, [navigate, username]);

  async function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);

    // Fetch the number of pages from the server and save it
    try {
      const response = await fetch("http://localhost:1337/api/get-pdf-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          numPages: numPages,
        }),
        credentials: "include", // Add this line
      });

       const uploadResponse = await fetch(
         "http://localhost:1337/api/upload-pdf-info",
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             Authorization: localStorage.getItem("token"),
           },
           body: JSON.stringify({
             emailId: username,
             numPages: numPages,
           }),
         }
       );

      if (!uploadResponse.ok) {
        throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      console.log(uploadData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  // ... (other state variables and functions)

  async function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    setFile(URL.createObjectURL(selectedFile));
    setPageNumber(1);

    // Get the number of pages from the PDF file
    try {
      const pdf = await pdfjs.getDocument(URL.createObjectURL(selectedFile))
        .promise;
      const totalNumPages = pdf.numPages;
      setNumPages(totalNumPages);
      console.log("Token:", localStorage.getItem("token"));
      // Fetch the number of pages from the server and save it
      const response = await fetch("http://localhost:1337/api/get-pdf-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          numPages: totalNumPages,
        }),
        credentials: "include", // Add this line
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      // Now, also upload PDF info to /api/upload-pdf-info
      const uploadResponse = await fetch(
        "http://localhost:1337/api/upload-pdf-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            emailId: username, // Assuming username is the user's email
            numPages: totalNumPages,
          }),
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      console.log(uploadData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleZoomOut() {
    if (zoom > 0.3) {
      setZoom((prevZoom) => prevZoom - 0.1);
    }
  }

  function handleZoomIn() {
    setZoom((prevZoom) => prevZoom + 0.1);
  }

  function handleLogout() {
    logout({ returnTo: window.location.origin });
    // navigate("/login");
  }
  console.log(numPages);

  return (
    <div className="pdf-container">
      <div className="pdf-sidebar">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="file-input"
        />
        <div className="toolbar">
          <button
            className="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            Previous Page
          </button>
          <button
            className="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            Next Page
          </button>
          <button className="button" onClick={handleZoomOut}>
            Zoom Out
          </button>
          <button className="button" onClick={handleZoomIn}>
            Zoom In
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          {/* <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button> */}
          <p>Username: {username}</p>
        </div>
        <div className="page-count">
          Page {pageNumber} of {numPages}
        </div>
      </div>
      <div className="pdf-window">
        {file && (
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={pageNumber}
              scale={zoom}
              renderTextLayer={false}
            />
          </Document>
        )}
      </div>
    </div>
  );
}

export default Pdf;
