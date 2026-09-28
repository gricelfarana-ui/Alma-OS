# Alma Inmobiliaria · Web

Web corporativa de **Alma Inmobiliaria** (Mallorca), construida a partir del manual *Sistema ALMA®*,
los copies de @almainmo y la identidad visual de las piezas publicadas (crema, azul noche y oro;
Cormorant Garamond + Montserrat).

Es una web estática: HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Estructura

```
index.html            Página principal (una sola página con anclas)
privacidad.html       Política de privacidad (plantilla, ver pendientes)
aviso-legal.html      Aviso legal (plantilla, ver pendientes)
assets/css/           styles.css + fonts.css (fuentes autoalojadas)
assets/fonts/         Cormorant Garamond y Montserrat (woff2, subconjunto latino)
assets/js/config.js   Datos de contacto (WhatsApp / email)
assets/js/main.js     Menú, Método ALMA® (pestañas), Reloj Valorador®, Canal ALMA®, formulario
assets/img/           Logotipo (símbolo), favicon e imagen para redes
```

## Secciones

1. **Inicio**: «Detrás de cada vivienda hay una historia» + la primera pregunta del método.
2. **Filosofía**: lo habitual en el sector frente a cómo trabaja Alma, y las tres cosas que nunca haremos.
3. **Método ALMA®**: las 6 etapas (Descubrir → Acompañar) en pestañas accesibles con teclado.
4. **Diagnóstico**: AEM® y el Reloj Valorador® interactivo (sobreprecio / alto / estratégico / oportunidad).
5. **Canal ALMA®**: demostración del grupo de WhatsApp con el propietario.
6. **Los pilares**: los 8 principios.
7. **Mallorca**: por qué la isla no se vende sola.
8. **Quién soy**: Gricel Ojeda y lo que más se repite en quienes han confiado.
9. **Preguntas frecuentes**.
10. **Contacto**: formulario con consentimiento RGPD.

## Ver en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar

- **Netlify** (recomendado): arrastra la carpeta o conecta el repositorio. No hay comando de build;
  el directorio de publicación es la raíz. El formulario funciona solo con Netlify Forms
  (las consultas llegan al panel de Netlify → Forms, y se pueden reenviar por email).
- **Otro alojamiento** (GitHub Pages, hosting propio…): rellena `whatsapp` o `email` en
  `assets/js/config.js`. El formulario abrirá WhatsApp o el correo con el mensaje ya preparado.

## Pendiente antes de publicar

- [x] **Datos de contacto** en `assets/js/config.js` (WhatsApp y email).
- [ ] **Datos legales** en `aviso-legal.html` y `privacidad.html` (razón social, NIF, dirección
      y, si procede, número del Registro de Agentes Inmobiliarios de las Illes Balears).
- [x] **Foto de Gricel** en `assets/img/gricel.jpg` (vertical, 4:5).
- [ ] **Logotipo en alta resolución**: el símbolo actual está extraído de una publicación de Instagram
      (`assets/img/alma-mark.png` y `alma-mark-light.png`). Si tienes el SVG o PNG original, sustitúyelos.
- [ ] **Dominio**: cuando lo tengas, usa la URL absoluta en `og:image` de `index.html` para que
      la vista previa en WhatsApp y redes funcione.
