import React, { useEffect, useRef, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";

import "../style/TagInput.css";

/**
 *
 * Built around react-tag-input module to deal with post edit form tags field
 *
 * @param form
 */
function TagInput({ ...form }) {
  const [state, setState] = useState({
    tags: [],
    suggestions: [],
  });

  // Grabs all tags from API and adds them as suggestions on mount
  useEffect(() => {
    fetch("/api/tags/")
      .then((res) => res.json())
      .then((res) => {
        let data = res.map((tag) => {
          return { id: String(tag["id"]), text: tag["name"] };
        });
        setState({ tags: [], suggestions: data });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Updates form field value on state change
  const latestForm = useRef(form);
  useEffect(() => {
    const namesList = state.tags.map((tag) => tag.text);
    latestForm.current.setFieldValue("tags", namesList, false);
  }, [state]);

  // When editing a post sets the post tags as form initial values
  useEffect(() => {
    let initialTags = form.initialValues.tags.map((tag) => {
      return { id: tag, text: tag };
    });
    setState({ tags: initialTags, suggestions: state.suggestions });
  }, [form.initialValues.tags, state.suggestions]);

  // Module required, handle tag delete
  function handleDelete(i) {
    const { tags } = state;
    setState({
      tags: tags.filter((tag, index) => index !== i),
      suggestions: state.suggestions,
    });
  }

  // Module required, handle tag addition
  function handleAddition(tag) {
    setState((state) => ({
      tags: [...state.tags, tag],
      suggestions: state.suggestions,
    }));
  }

  // Module tag drag handler
  function handleDrag(tag, currPos, newPos) {
    const tags = [...state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    setState({
      tags: newTags,
      suggestions: state.suggestions,
    });
  }

  return (
    <ReactTags
      tags={state.tags}
      suggestions={state.suggestions}
      handleDelete={handleDelete}
      handleAddition={handleAddition}
      handleDrag={handleDrag}
      placeholder=""
      autofocus={false}
    />
  );
}

export default TagInput;
