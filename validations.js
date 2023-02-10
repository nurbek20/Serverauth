import {body} from "express-validator"

export const registerValidation=[
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен ьыт минимум 5 символов').isLength({min:5}),
    body('fullName', "Укажите имя").isLength({min:3}),
    body('avatarUrl', 'Неверный ссылка на аватарку').optional().isURL()
]

export const loginValidation=[
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен ьыт минимум 5 символов').isLength({min:5})
]

export const postCreateValidation=[
    body("title", "Введите заголовок пост").isLength({min:3}).isString(),
    body("description", "Введите описание поста").isLength({min:3}).isString(),
    body("imageUrl", "Неверная ссылка на изображении").optional().isString()
]