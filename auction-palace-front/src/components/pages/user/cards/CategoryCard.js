function CategoryCard(props) {
  return (
    <div className="category-card">
      <h1>{props.name}</h1>
      <p>{props.cat_num} δημοπρασίες</p>
      <p>Από {props.min_bid} πόντους</p>
      <p>Μέχρι {props.max_bid} πόντους</p>
    </div>
  );
}

export default CategoryCard;
