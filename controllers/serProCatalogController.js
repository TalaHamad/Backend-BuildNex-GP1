import Catalog from '../models/catalogModel.js';

export const getCatalogItems = async (req, res) => {
  try {
    const serviceProviderId = req.user; 

    const catalogItems = await Catalog.findAll({
      where: {
        ServiceProviderID: serviceProviderId,
      },
      attributes: ['CatalogID','ItemImage', 'ItemName','ItemPrice' ,'ItemRating'],
    });

    res.status(200).json(catalogItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch catalog items' });
  }
};

export const addItemToCatalog = async (req, res) => {
  try {
  
    const serviceProviderId = req.user; 

    const { itemName, itemImage, itemPrice, itemDescription , itemColors } = req.body;
       
    console.log(req.body);
    if (!itemName || !itemImage || !itemPrice || !itemDescription || !itemColors) {
      return res.status(400).json('All Fields are required');
    }

    const newItem = await Catalog.create({
      ServiceProviderID: serviceProviderId,
      ItemName: itemName,
      ItemDescription: itemDescription,
      ItemPrice: itemPrice,
      ItemColors:itemColors,
      ItemImage: itemImage,
      ItemRating: 0.0,
    });

    res.status(200).json(newItem.CatalogID);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to catalog' });
  }
};

export const getItemDetails = async (req, res) => {
  try {
    const { catalogId } = req.params;

    const itemDetails = await Catalog.findByPk(catalogId);

    if (!itemDetails) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(itemDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch item details' });
  }
};

export const editItem = async (req, res) => {
  try {
    
    const { catalogId } = req.params; 
    const { itemName,  itemPrice, itemDescription, itemColors } = req.body;

    const existingItem = await Catalog.findOne({
      where: { CatalogID: catalogId},
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    existingItem.ItemName = itemName || existingItem.ItemName;
    existingItem.ItemPrice = itemPrice || existingItem.ItemPrice;
    existingItem.ItemDescription = itemDescription || existingItem.ItemDescription;
    existingItem.ItemColors = itemColors || existingItem.ItemColors;

    await existingItem.save();

    res.status(200).json('Item updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to edit item in catalog' });
  }
};

export const editItemImage = async (req, res) => {
  try {
    
    const { catalogId } = req.params; 
    const { itemImage } = req.body;


    const existingItem = await Catalog.findOne({
      where: { CatalogID: catalogId},
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    existingItem.ItemImage = itemImage || existingItem.ItemImage;

    await existingItem.save();

    res.status(200).json('Item Image updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to edit item Image in catalog' });
  }
};
