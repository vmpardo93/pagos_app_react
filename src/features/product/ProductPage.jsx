import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './productSlice';
import { addToCheckout, openModal } from '../../features/checkout/checkoutSlice';
import Button from '../../components/Button';
import './ProductPage.css';

const ProductPage = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="product-page">
        <header className="product-page__header">
          <h1 className="product-page__title">Productos</h1>
          <p className="product-page__subtitle">Explora nuestro catálogo</p>
        </header>
        <div className="product-page__grid product-page__grid--loading">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="product-card product-card--skeleton">
              <div className="product-card__image product-card__image--skeleton" />
              <div className="product-card__body">
                <div className="product-card__title-skeleton" />
                <div className="product-card__price-skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <header className="product-page__header">
          <h1 className="product-page__title">Productos</h1>
        </header>
        <div className="product-page__error">
          <span className="product-page__error-icon" aria-hidden>⚠</span>
          <p>{error}</p>
          <Button onClick={() => dispatch(fetchProducts())}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <header className="product-page__header">
        <h1 className="product-page__title">Productos</h1>
        <p className="product-page__subtitle">
          {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
        </p>
      </header>

      {products.length === 0 ? (
        <div className="product-page__empty">
          <p>No hay productos disponibles por el momento.</p>
        </div>
      ) : (
        <div className="product-page__grid">
          {products.map((product) => (
            <article
              key={product.id}
              className="product-card"
              itemScope
              itemType="https://schema.org/Product"
            >
              <div className="product-card__image-wrap">
                <img
                  src={product.image ?? product.imageUrl ?? 'https://placehold.co/400x300/e2e8f0/64748b?text=Sin+imagen'}
                  alt={product.name ?? product.title ?? 'Producto'}
                  className="product-card__image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Sin+imagen';
                  }}
                />
              </div>
              <div className="product-card__body">
                <h2 className="product-card__title" itemProp="name">
                  {product.name ?? product.title ?? 'Sin nombre'}
                </h2>
                {product.description && (
                  <p className="product-card__description" itemProp="description">
                    {product.description}
                  </p>
                )}
                {product.stock && (
                  <p className="product-card__description" itemProp="stock">
                    {product.stock}
                  </p>
                )}
                <div className="product-card__footer">
                  <span className="product-card__price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span itemProp="price" content={product.price}>
                      ${Number(product.price ?? 0).toLocaleString('es')}
                    </span>
                  </span>
                  <Button
                    variant="primary"
                    className="product-card__btn"
                    onClick={() => {
                      dispatch(addToCheckout(product));
                      dispatch(openModal());
                    }}
                  >
                    Pagar con tarjeta
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
