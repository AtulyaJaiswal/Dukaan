import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({cat}) => {
  console.log(cat);
  return (
    <Fragment>
     <Link className='category' to={`/products/${cat.categoryName}`}>
        <img
          src={cat.photoCategory.url}
          alt="Category"
        />
        <p>{cat.categoryName}</p>
     </Link>
    </Fragment>
  )
}

export default CategoryCard