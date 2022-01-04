const pName = document.querySelector("#auto-name");
const caption = document.querySelector("#auto-caption");
const tags = document.querySelector("#auto-tags");
const image = document.querySelector("#auto-image");
const medias = document.querySelector("#auto-medias");
const contactButton = document.querySelector("#contact-button");

// eslint-disable-next-line no-undef
const lightbox = new Lightbox({ });

function getPagePhotographerId () {
  let paramsString = window.location.href.split("?");
  paramsString.shift();
  paramsString = paramsString.join("?");

  const searchParams = new URLSearchParams(paramsString);

  return searchParams.get("photographerid").toString();
}

function mediaElementTemplate ({ title, likes, name, filename, type, alt, date }) {
  const element = document.createElement("li");
  element.className = "medias-item";
  element.setAttribute("filter-title", title);
  element.setAttribute("filter-likes", likes);
  element.setAttribute("filter-date", date);

  element.innerHTML = `<article class="medias-container">
  <div class="medias-infos">
    <p class="medias-infos-title">${title}</p>
    <span class="medias-infos-likes">${likes} <i class="fas fa-heart"></i></span>
  </div>
</article>`;

  if (type === "image") {
    const imageElement = document.createElement("img");
    imageElement.src = `/img/Sample Photos/${name}/${filename}`;
    imageElement.alt = alt;
    imageElement.className = "medias-thumb";
    imageElement.setAttribute("open-lightbox", true);

    element.querySelector(".medias-container").prepend(imageElement);
  } else if (type === "video") {
    const videoElement = document.createElement("video");
    videoElement.src = `/img/Sample Photos/${name}/${filename}`;
    videoElement.setAttribute("open-lightbox", true);
    videoElement.className = "medias-thumb";
    // videoElement.alt = alt;

    const videoSourceElement = document.createElement("source");
    videoSourceElement.src = `/img/Sample Photos/${name}/${filename}`;
    videoSourceElement.type = "video/mp4";
    videoElement.appendChild(videoSourceElement);

    element.querySelector(".medias-container").prepend(videoElement);
  } else return element;

  return element;
}

(function () {
  // eslint-disable-next-line no-undef
  request("/data/FishEyeData.json", "GET")
    .then((data) => {
      try {
        data = JSON.parse(data);

        const targetProfile = data.photographers.find(
          (p) => p.id.toString() === getPagePhotographerId()
        );
        const targetMedias = data.media.filter(function (el) {
          return el.photographerId.toString() === getPagePhotographerId();
        });

        pName.innerText = targetProfile.name;
        caption.innerHTML = `${targetProfile.city}, ${targetProfile.country} <span>${targetProfile.tagline}</span>`;
        image.src = `/img/Sample Photos/Photographers ID Photos/${targetProfile.portrait}`;
        image.alt = targetProfile.alt;
        targetProfile.tags.forEach((t) => {
          const tagElement = document.createElement("li");
          tagElement.innerHTML = `<span class="tag"
    ><a href="#!" class="tag-text">#${t}</a></span
  >`;

          tags.appendChild(tagElement);
        });

        // eslint-disable-next-line no-unused-vars
        const contactform = new ContactForm({ // eslint-disable-line no-undef
          name: targetProfile.name,
          handler: contactButton
        });

        const lightboxMedias = [];

        targetMedias.forEach((media) => {
          medias.appendChild(
            mediaElementTemplate({
              filename: media.image || media.video,
              type: media.image ? "image" : "video",
              likes: media.likes,
              name: targetProfile.name,
              title: media.title,
              alt: media.alt,
              date: media.date
            })
          );

          const lightboxMediaParameters = {
            filename: (
              `/img/Sample Photos/${targetProfile.name}/${
                media.image || media.video
              }`
            ),
            type: media.image ? "image" : "video",
            title: media.title,
            alt: media.alt,
            likes: media.likes,
            date: media.date
          };

          lightboxMedias.push(lightboxMediaParameters);
        });

        lightbox.setMedias(lightboxMedias);
        lightbox.updateHandlers();
        // eslint-disable-next-line no-undef
        applyFilter("likes");
      } catch (e) {
        console.log(e);
        alert("Une erreur est survenue lors du chargement du profil. Code 1");
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Une erreur est survenue lors du chargement du profil. Code 2");
    });
})();
