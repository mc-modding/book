description: Создание собственных достижений.

# Создание достижения

Перейдём по пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
                    └── advancements
                        └── craft
```

Создадим файл `key_achievement.json`.
```json
{
    "display": {
        "icon": {
            "item": "minecraft:wool",
            "data": 6
        },
        "title": {
            "translate": "advancements.tutorial.key.title"
        },
        "description": {
            "translate": "advancements.tutorial.key.description"
        },
        "frame": "goal"
    },
    "parent": "tut:craft/root",
    "criteria": {
        "recipe_unlocked": {
            "trigger": "minecraft:recipe_unlocked",
            "conditions": {
                "recipe": "tut:key"
            }
        }
    }
}
```

* `frame` - это рамка самого достижения, существует всего два вида рамок (если не считать обычную): `goal` и `challenge`

В данном случае достижение будет получено, если мы откроем рецепт.