import React, { useEffect, useState } from 'react';
import { api } from './api';

const formularioVacio = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria_id: ''
};

const iconos = {
  Photocards: '♡',
  Accesorios: '✦',
  Papelería: '✎',
  'Ropa y bolsas': '☁'
};

function App() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');
      const [resProductos, resCategorias] = await Promise.all([
        api.get('/productos'),
        api.get('/categorias')
      ]);
      setProductos(resProductos.data);
      setCategorias(resCategorias.data);
    } catch (err) {
      setError('No se pudo conectar con la API. Verifica que el backend esté encendido y que MySQL tenga las tablas creadas.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirNuevo = () => {
    setProductoEditando(null);
    setFormulario({ ...formularioVacio, categoria_id: categorias[0]?.id || '' });
    setMostrarFormulario(true);
    setMensaje('');
  };

  const abrirEdicion = (producto) => {
    setProductoEditando(producto);
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      categoria_id: producto.categoria_id
    });
    setMostrarFormulario(true);
    setMensaje('');
  };

  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (productoEditando) {
        await api.put(`/productos/${productoEditando.id}`, formulario);
        setMensaje('¡Artículo actualizado!');
      } else {
        await api.post('/productos', formulario);
        setMensaje('¡Artículo agregado al catálogo!');
      }
      setMostrarFormulario(false);
      setProductoEditando(null);
      setFormulario(formularioVacio);
      await cargarDatos();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo guardar. Revisa la conexión con el backend.');
    }
  };

  const eliminarProducto = async (producto) => {
    if (!window.confirm(`¿Seguro que quieres eliminar “${producto.nombre}”?`)) return;
    try {
      await api.delete(`/productos/${producto.id}`);
      setMensaje('Artículo eliminado del catálogo.');
      await cargarDatos();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo eliminar el artículo.');
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideTexto = `${producto.nombre} ${producto.descripcion || ''} ${producto.categoria}`
      .toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'todas' || String(producto.categoria_id) === categoriaFiltro;
    return coincideTexto && coincideCategoria;
  });

  const dinero = (valor) => `$${Number(valor).toFixed(2)}`;

  return (
    <div className="app-shell">
      <div className="announcement">UN CATÁLOGO HECHO POR UNA STAY, PARA STAYS ♡</div>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Inicio Han Quokka Shop">
          <span className="brand-icon">H</span>
          <span>han quokka<span className="brand-light"> shop</span></span>
        </a>
        <nav><a href="#catalogo">Catálogo</a><a href="#sobre">Sobre el proyecto</a></nav>
        <button className="add-button top-add" onClick={abrirNuevo}>＋ Agregar artículo</button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">HAN JISUNG · HAN QUOKKA · FAN COLLECTION</p>
            <h1>Pequeños tesoros,<br /><span>mucho amor.</span></h1>
            <p className="hero-description">Un rinconcito para organizar photocards, accesorios y detalles inspirados en Han Jisung. Encuentra tu siguiente favorito. ♡</p>
            <a href="#catalogo" className="hero-link">Explorar colección <span>↘</span></a>
            <div className="hero-stats">
              <div><strong>{productos.length.toString().padStart(2, '0')}</strong><span>artículos</span></div>
              <i></i>
              <div><strong>{categorias.length.toString().padStart(2, '0')}</strong><span>categorías</span></div>
              <i></i>
              <div><strong>∞</strong><span>amor por Han</span></div>
            </div>
          </div>
          <div className="hero-art" aria-label="Ilustración decorativa de la colección">
            <div className="sparkle sparkle-one">✦</div><div className="sparkle sparkle-two">✧</div>
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="hero-blob"><span className="blob-face">•ᴗ•</span><span className="blob-cheek left"></span><span className="blob-cheek right"></span></div>
            <div className="floating-card card-one"><span>♡</span><small>HAN</small><b>JISUNG</b></div>
            <div className="floating-card card-two"><span>✦</span><b>STAY</b><small>COLLECTION</small></div>
            <div className="tiny-heart">♡</div>
            <div className="hero-note">made with love<br />for STAY <span>♥</span></div>
          </div>
        </section>

        <section className="catalog-section" id="catalogo">
          <div className="section-heading">
            <section className="hannie-quotes">
  <div className="hannie-quotes-heading">
    <p>♡ UN POQUITO DE HANNIE ♡</p>
    <h2>Palabras para <span>el corazón</span></h2>
  </div>

  <div className="hannie-quotes-grid">
    <article className="hannie-quote-card">
      <span className="hannie-quote-flower">✿</span>
      <p className="hannie-quote-text">"This too, shall pass."</p>
      <p className="hannie-quote-translation">
        Esto también pasará.
      </p>
      <small>— Lema de Han ♡</small>
    </article>

    <article className="hannie-quote-card">
      <span className="hannie-quote-flower">♡</span>
      <p className="hannie-quote-text">"Life is not easy."</p>
      <p className="hannie-quote-translation">
        La vida no es fácil.
      </p>
      <small>— Han, entrevista con Seventeen</small>
    </article>

    <article className="hannie-quote-card">
      <span className="hannie-quote-flower">✧</span>
      <p className="hannie-quote-text">"I'm gonna kill it today."</p>
      <p className="hannie-quote-translation">
        Hoy voy a darlo todo.
      </p>
      <small>— Han, antes de salir al escenario</small>
    </article>
  </div>
</section>
            <div><p className="eyebrow">TU COLECCIÓN FAVORITA</p><h2>El pequeño <span>catálogo</span></h2><p className="section-subtitle">Artículos fan-made de demostración. Los datos se guardan en MySQL.</p></div>
            <button className="add-button desktop-hidden" onClick={abrirNuevo}>＋ Agregar artículo</button>
          </div>

          <div className="toolbar">
            <label className="search-box"><span>⌕</span><input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar un artículo..." /></label>
            <select className="filter-select" value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} aria-label="Filtrar por categoría">
              <option value="todas">Todas las categorías</option>
              {categorias.map((categoria) => <option key={categoria.id} value={String(categoria.id)}>{categoria.nombre}</option>)}
            </select>
          </div>

          {mensaje && <div className="notice success-notice">♡ {mensaje}<button onClick={() => setMensaje('')} aria-label="Cerrar mensaje">×</button></div>}
          {error && <div className="notice error-notice">{error}<button onClick={() => setError('')} aria-label="Cerrar error">×</button></div>}

          {mostrarFormulario && <section className="form-panel">
            <div className="form-heading"><div><p className="eyebrow">ADMINISTRA TU COLECCIÓN</p><h3>{productoEditando ? 'Editar artículo' : 'Agregar artículo nuevo'}</h3></div><button className="close-button" onClick={() => setMostrarFormulario(false)} aria-label="Cerrar formulario">×</button></div>
            <form onSubmit={guardarProducto} className="product-form">
              <label>Nombre del artículo<input name="nombre" value={formulario.nombre} onChange={cambiarCampo} required maxLength="100" placeholder="Ej. Photocard fan-made" /></label>
              <label>Categoría<select name="categoria_id" value={formulario.categoria_id} onChange={cambiarCampo} required><option value="">Selecciona una categoría</option>{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}</select></label>
              <label className="full-field">Descripción<textarea name="descripcion" value={formulario.descripcion} onChange={cambiarCampo} maxLength="255" rows="2" placeholder="Describe este artículo..." /></label>
              <label>Precio ($)<input name="precio" type="number" min="0" step="0.01" value={formulario.precio} onChange={cambiarCampo} required /></label>
              <label>Unidades disponibles<input name="stock" type="number" min="0" step="1" value={formulario.stock} onChange={cambiarCampo} required /></label>
              <div className="form-actions"><button type="button" className="cancel-button" onClick={() => setMostrarFormulario(false)}>Cancelar</button><button type="submit" className="add-button">{productoEditando ? 'Guardar cambios' : 'Agregar al catálogo'}</button></div>
            </form>
          </section>}

          {cargando ? <div className="empty-state"><span className="loading-dot">♡</span><p>Cargando la colección...</p></div> : productosFiltrados.length === 0 ? <div className="empty-state"><span>♡</span><h3>No encontramos artículos</h3><p>Prueba con otra búsqueda o agrega tu primer artículo.</p><button className="add-button" onClick={abrirNuevo}>Agregar artículo</button></div> : <div className="product-grid">
            {productosFiltrados.map((producto, index) => <article className={`product-card tone-${index % 4}`} key={producto.id}>
             <div className="product-visual">
  <span className="product-label">FAN-MADE</span>

 {producto.nombre.toLowerCase().includes('sticker') ? (
  <img className="product-photo" src="/imagenes/stickerss.jpg" alt={producto.nombre} />
) : producto.nombre.toLowerCase().includes('holder') ? (
  <img className="product-photo" src="/imagenes/llavero.jpg" alt={producto.nombre} />
) : producto.nombre.toLowerCase().includes('llavero') ? (
  <img className="product-photo" src="/imagenes/llaveropeluche.jpg" alt={producto.nombre} />
) : producto.nombre.toLowerCase().includes('tote') ? (
  <img className="product-photo" src="/imagenes/bolsa.jpg" alt={producto.nombre} />
) : producto.nombre.toLowerCase().includes('separador') ? (
  <img className="product-photo" src="/imagenes/fanmade.jpg" alt={producto.nombre} />
) : producto.nombre.toLowerCase().includes('photocard') ? (
  <img className="product-photo" src="/imagenes/photocards.jpg" alt={producto.nombre} />
) : (
  <span className="product-art">
    {iconos[producto.categoria] || '♡'}
  </span>
)}

  <span className="product-number">
    HQ · {String(producto.id).padStart(2, '0')}
  </span>
</div>

              <div className="product-info"><div className="product-category">{producto.categoria}</div><h3>{producto.nombre}</h3><p className="product-description">{producto.descripcion}</p><div className="product-bottom"><strong>{dinero(producto.precio)}</strong><span className={Number(producto.stock) < 4 ? 'stock low-stock' : 'stock'}>{producto.stock} disponibles</span></div>
                <div className="card-actions"><button onClick={() => abrirEdicion(producto)} className="edit-button">✎ Editar</button><button onClick={() => eliminarProducto(producto)} className="delete-button">Eliminar</button></div>
              </div>
            </article>)}
          </div>}
        </section>

        <section className="about-section" id="sobre"><div className="about-mark">♡</div><div><p className="eyebrow">UN PROYECTO ESCOLAR</p><h2>Un espacio para cada <span>pequeño tesoro.</span></h2><p>Han Quokka Shop es un catálogo de demostración creado para practicar React, Axios, Express y MySQL. Los artículos que aparecen son ejemplos editables y no representan una tienda oficial.</p></div><div className="about-stamp">MADE<br />FOR STAY <span>✦</span></div></section>
      </main>
      <section className="letter-section" id="carta">
  <div className="letter-card">
    <span className="letter-decoration">✿ ♡ ✿</span>
    <p className="letter-label">UNA CARTITA PARA HANNIE</p>

    <h2>Querido Hannie,</h2>

    <p>
      Gracias por compartir tu talento, tu música y esa energía
      tan bonita con el mundo. Tus canciones llevan sonrisas,
      consuelo e inspiración a muchísimas personas.
    </p>

    <p>
      Espero que la vida te dé tanta felicidad como la que tú
      brindas a tus fans. Sigue haciendo lo que amas, cuídate
      mucho y recuerda que valoramos todo tu esfuerzo. ♡
    </p>

    <p className="letter-signature">
      Con muchísimo cariño, una STAY ♡
    </p>
  </div>
</section>

<section className="little-message-section">
  <div className="little-message-card">
    <span className="message-flower">☘</span>

    <p className="letter-label">UN PEQUEÑO REGALO PARA TI</p>
    <h2>Un mensajito para ti ♡</h2>

    <p>
      Un pequeño recordatorio bonito para alegrarte el día.
    </p>

    <details className="surprise-details">
      <summary>Abre tu pequeña sorpresa ♡</summary>

      <div className="surprise-content">
        <p>Hoy mereces pequeños momentos de felicidad. ♡</p>
        <p>Paso a paso, lo estás haciendo muy bien. ✿</p>
        <p>No olvides cuidar de ti. 🌱</p>
        <span>¡Te mandamos un abracito de quokka! ♡</span>
      </div>
    </details>
  </div>
</section>
      <footer><a className="brand footer-brand" href="#inicio"><span className="brand-icon">H</span><span>han quokka<span className="brand-light"> shop</span></span></a><span>Hecho con ♡ para el proyecto de Desarrollo de Software</span><a href="#inicio" className="back-top">Volver arriba ↑</a></footer>
    </div>
  );
}

export default App;
