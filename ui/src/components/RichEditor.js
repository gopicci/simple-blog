import React from "react";
import ReactQuill from "react-quill";

import { getCookie } from "../services/AuthService";

import "../style/RichEditor.css";

/**
 * Rich text editor using Quill
 */
class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(html) {
    this.setState({ editorHtml: html });
  }

  modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: this.imageHandler,
      },
    },
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  // Upload selected image through API and add to editor
  imageHandler() {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];

      const formData = new FormData();
      formData.append("image", file);

      let csrfToken = getCookie("csrftoken");
      fetch("/api/image/", {
        method: "post",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          const range = this.quill.getSelection(true);

          this.quill.insertEmbed(range.index, "image", res["image"]);
        })
        .catch((error) => {
          console.error(error);
        });
    };
  }

  render() {
    return (
      <div className="quill-container">
        <ReactQuill
          ref={(el) => {
            this.quill = el;
          }}
          theme="snow"
          modules={this.modules}
          formats={this.formats}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}
export default RichEditor;
