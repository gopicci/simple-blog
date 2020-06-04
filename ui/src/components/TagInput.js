import React, {useEffect, useState} from 'react';
import '../style/TagInput.css';
import { WithContext as ReactTags } from 'react-tag-input';


function TagInput ({...form}) {

  const [state, setState] = useState({
    tags: [],
    suggestions: []
  });

  useEffect(() => {
    // Grabs all tags from api and adds to suggestions when state is []
    fetch('/api/tags/')
      .then(res => res.json())
      .then(res => {
        let data = res.map(tag => {
          let suggestion = {id: String(tag['id']), text: tag['name']}
          return suggestion
        });
        setState({tags: state.tags, suggestions: data})
        return res
      })
      .catch((error) => {
        console.error(error);
      });
  },[])

  useEffect(() => {
    // Updates form field value on state change
    const namesList = state.tags.map(tag => tag.text)
    form.setFieldValue('tags', namesList, false)
  }, [state])


  useEffect(() => {
    // Sets initial tags on editing form
    let initialTags = form.initialValues.tags.map(tag => {
      let tags = {id: tag, text: tag}
      return tags
    });
    setState({tags: initialTags, suggestions: state.suggestions})
  }, [form.initialValues.tags])


  function handleDelete(i) {
    // Package required delete
    const { tags } = state;
    setState({
     tags: tags.filter((tag, index) => index !== i),
     suggestions: state.suggestions
    });
  }

  function handleAddition(tag) {
    // Package required add
    setState(state => ({
      tags: [...state.tags, tag],
      suggestions: state.suggestions
    }));
  }

  function handleDrag(tag, currPos, newPos) {
    // Package drag
    const tags = [...state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    setState({
      tags: newTags,
      suggestions: state.suggestions
    });
  }

  return (
    <ReactTags
      tags={state.tags}
      suggestions={state.suggestions}
      handleDelete={handleDelete}
      handleAddition={handleAddition}
      handleDrag={handleDrag}
      placeholder=''
      autofocus={false}
    />
  )
};

export default TagInput;