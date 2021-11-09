export const PostForm = ({
  title,
  setTitle,
  description,
  setDescription,
  canSave,
  savePostClicked,
}) => {
  const onTitleChanged = (event) => {
    setTitle(event.target.value);
  };
  const onDescriptionChanged = (event) => {
    setDescription(event.target.value);
  };

  return (
    <form className="mb-3" autoComplete="off">
      <label className="form-label" htmlFor="postTitle">
        Announcement Title:
      </label>
      <input
        type="text"
        id="postTitle"
        name="postTitle"
        className="form-control"
        value={title}
        onChange={onTitleChanged}
      />

      <label className="form-label" htmlFor="postContent">
        Description:
      </label>
      <textarea
        className="form-control"
        id="postContent"
        name="postContent"
        rows="3"
        value={description}
        onChange={onDescriptionChanged}
      />

      <div className="row justify-content-end mt-2">
        <div className="col-auto">
          <button
            // text-white
            className=" btn  border border-primary rounded "
            disabled={!canSave}
            onClick={savePostClicked}
            type="button"
          >
            Save Announcement
          </button>
        </div>
      </div>
    </form>
  );
};
