const Category = require('../models/category_model')
const categoryOffer = require('../models/categoryOffer_model')




const loadCategory = async (req, res) => {
    try {
        const categoriesData = await Category.find().populate('offers');
        console.log(categoriesData);
        let success = req.flash('success')
        res.render('categoryList', { success, categoriesData, })
    } catch (error) {
        console.log(error);
    }
}

const loadAddingCategory = async (req, res) => {
    try {
        let errmsg = req.flash('errmsg')
        let success = req.flash('success')
        res.render('categoryAdd', { errmsg, success })
    } catch (error) {
        console.log(error);
    }
}

const addNewCategory = async (req, res) => {
    try {
        const categoryName = req.body.categName;
        const capitalLetter = categoryName.toUpperCase();
        const exist = await Category.findOne({ name: capitalLetter })
        if (exist) {
            req.flash("errmsg", "Category Already Exists.")
            res.redirect("/admin/categoryAdd")
        } else {
            const newCategory = new Category({
                name: capitalLetter
            })
            const categorydata = await newCategory.save();
            if (categorydata) {
                req.flash('success', 'Category adding successfull')
                res.redirect('/admin/categoryList')
            }
        }
    } catch (error) {
        console.log(error, "while adding category");
    }
}

const loadcategoryListUnlist= async (req, res) => {
    try {
        const categoryid = req.query.categoryid
        const categorydata = await Category.findOne({ _id: categoryid })
        const isListed = categorydata.is_Listed
        if (isListed == true) {
            await Category.findByIdAndUpdate(categoryid, { $set: { is_Listed: false } })
            return res.json({ success: true })
        } else {
            await Category.findByIdAndUpdate(categoryid, { $set: { is_Listed: true } })
            return res.json({ success: true })
        }
    } catch (error) {
        console.log(error);
    }
}

const loadCategoryEdit = async (req, res) => {
    try {
        const id = req.query.categoryId
        const categeoryDetail = await Category.findOne({ _id: id })
        let errmsg = req.flash('errmsg')
        let success = req.flash('success')
        res.render('categoryEdit', { errmsg, success, categeoryDetail })
    } catch (error) {
        console.log(error);
    }
}


const categoryEditing = async (req, res) => {
    try {
        const categoryId = req.body.id;
        const newName = req.body.editName.toUpperCase();
        const categories = await Category.find();
        const categoryExists = categories.some(category => {
            return category.name.toUpperCase() === newName && category._id.toString() !== categoryId;
        })
        if (categoryExists) {
            req.flash('errmsg', "Category Already Exists");
            res.redirect('/admin/categoryEdit')
        } else {
            await Category.findByIdAndUpdate({ _id: categoryId }, { $set: { name: newName } })
            req.flash('success', " Category Updated Successfull")
            return res.redirect('/admin/categoryList');
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    loadCategory,
    addNewCategory,
    loadAddingCategory,
    loadcategoryListUnlist,
    loadCategoryEdit,
    categoryEditing
}