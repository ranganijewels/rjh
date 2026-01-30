export const mapApiMenuToOptions = (apiData, staticOptions) => {
  return staticOptions?.map((staticMenu) => {
    const apiMenu = apiData.find(
      (menu) => menu?.name.toLowerCase() === staticMenu?.title.toLowerCase()
    );

    let categories = [...staticMenu?.categories];
    let imageSection = [...(staticMenu?.imageSection || [])];

    if (apiMenu) {
      const apiStyleGroup = (apiMenu?.menu_groups || []).find(
        (group) => group.name.toLowerCase() === "shop by style"
      );

      // Determine if we should add category_id
      const addCategoryId = apiMenu.name.toLowerCase() === "engagement";
      const categoryIdParam = addCategoryId
        ? "&category_id=10"
        : "&collection=wedding&category_id=1";

      if (apiStyleGroup) {
        categories = categories.map((cat) =>
          cat.title.toLowerCase() === "shop by style"
            ? {
                title: "SHOP BY STYLE",
                items: (apiStyleGroup?.menu_items || []).map((item) => {
                  const id = item?.menu?.id ?? "";
                  const name = item?.menu?.name ?? "";

                  // encode id + name as Base64
                  const encoded = btoa(JSON.stringify({ id, name }));

                  if (name.toLowerCase() === "two tone") {
                    return {
                      label: name,
                      link: `/product?metal=two tone${categoryIdParam}`,
                    };
                  }

                  return {
                    label: name,
                    link: `/product?subcat=${id}${categoryIdParam}`,
                  };
                }),
              }
            : cat
        );
      }

      if (apiMenu.image && apiMenu.name.toLowerCase() !== "customize") {
        imageSection = [
          {
            imageUrl: apiMenu.image,
            callToAction: {
              text: "EXPLORE COLLECTION",
              url: `/product?collection=${apiMenu.slug}${categoryIdParam}`,
            },
            additionalTitle: `Shop ${apiMenu.name}`,
            additionalDescription: `Discover our ${apiMenu.name.toLowerCase()} collection.`,
          },
        ];
      }
    }

    return {
      ...staticMenu,
      categories,
      imageSection,
    };
  });
};
