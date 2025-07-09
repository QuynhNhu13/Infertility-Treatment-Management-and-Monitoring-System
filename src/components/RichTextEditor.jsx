import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const RichTextEditor = ({ value, onChange }) => {
  return (
    <div className="rich-text-editor">
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow"
        placeholder="Nhập nội dung..."
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ],
        }}
      />
    </div>
  );
};

export default RichTextEditor;
