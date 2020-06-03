import React from 'react';
import ReactQuill from 'react-quill';
import '../style/RichEditor.css';

function RichEditor({value, onChange}) {


  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  return (
    <div className='quill-container'>
    <ReactQuill theme="snow"
                modules={modules}
                formats={formats}
                value={value}
                onChange={onChange}
    />
    </div>
  );
}
export default RichEditor;