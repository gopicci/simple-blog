import React, {useEffect, useState} from 'react';
import '../style/TagInput.css';
import { WithContext as ReactTags } from 'react-tag-input';


function TagInput ({...form}) {

    const [state, setState] = useState({
            tags: [],
            suggestions: []
        });

    useEffect(() => {
      fetch('api/tags/')
        .then(res => res.json())
        .then(res => {
          let data = res.map(tag => {
            let suggestion = {id: String(tag['id']), text: tag['name']}
            return suggestion
          });
          setState({tags: [], suggestions: data})
          console.log(data)
          return res
        })
        .catch((error) => {
          console.log(error);
        });
    },[])

    useEffect(() => {
      const namesList = state.tags.map(tag => tag.text)
      form.setFieldValue('tags', namesList, false)
    }, [state])

    function handleDelete(i) {
        const { tags } = state;
        setState({
         tags: tags.filter((tag, index) => index !== i),
         suggestions: state.suggestions
        });
    }

    function handleAddition(tag) {
        setState(state => ({
          tags: [...state.tags, tag],
          suggestions: state.suggestions
        }));

    }

    function handleDrag(tag, currPos, newPos) {
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