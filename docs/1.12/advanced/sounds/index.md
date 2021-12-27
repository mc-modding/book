description: Добавление своих звуков в игру.

# Звуки

Создадим файл `sounds.json` и папку `sounds` по пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
```
У вас в папке `tut` должен быть создан файл `sounds.json`!

Отредактируем его!
```json
{
    "test_sound": {
        "category": "player",
        "sounds": ["*modid*:myTestSound"]
    }
}
```
* `category` - указывает на то, какая категория будет у данного звука, т.е. если мы указали `player`, то в игре, в настройках звука мы сможем отключить свой звук передвинув ползунок `Игроки`. Категории звуков в игре:
    - `master` - общие звуки
    - `music` - музыка
    - `record` - пластинка
    - `weather` - погода
    - `block` - блоки
    - `hostile` - враждебные сущности
    - `neutral` - нейтральные или дружелюбные(как написано в игре)
    - `player` - игроки
    - `ambient` - окружение
    - `voice` - голос/речь
* `sounds` - массив звуковых файлов, который будет поочерёдно проигрываться.
    - `name` - название звука без формата
    - `volume` - громкость. Чем выше значение, тем дальше будет слышимость
    - `pitch` - высота звука. Если 1.0, то звук будет нормально проигрываться, если же ниже, то звук будет иметь эффект замедления
    - `weight` - шанс воспроизведения звука
    - `stream` - имеет два положения `true/false`, при `true` проигрывается звук из файла. Это нужно, чтобы избежать проблем со звучанием звука в игре, т.е. если ваш звук более одной минуты, то рекомендуется выставить данный параметр на `true`.

Продвинутый пример:
```json
{
    "test_sound": {
        "category": "player",
        "sounds": [
            {
                "name": "*modid*:myTestSound",
                "stream": true
            },
            {
                "name": "*modid*:myTestSound2",
                "pitch": 0.2,
                "weight": 2.0
            }
        ]
    },
    "nextSound": {
        "sounds": ["*modid*:nextSound"]
    }
}
```

Создадим класс `Sounds`.

```java
public class Sounds {
    //Это наш звук, `test_sound` это название звука указанного в sounds.json
    public static final SoundEvent test = registry("test_sound");

    @SubscribeEvent
    public void registerSounds(RegistryEvent.Register<SoundEvent> e) {
        //Регистрация звука
        ForgeRegistries.SOUND_EVENTS.register(test);
    }

    //Упрощённая регистрация звука
    private SoundEvent registry(String name) {
        ResourceLocation uniqueName = new ResourceLocation(*modid*, name);
        return new SoundEvent(uniqueName).setRegistryName(uniqueName);
    }
}
```
`*modid*` - это modId мода

Чтобы воспроизвести наш звук, добавим такой код:
```java
/**
 *  blockPos - это позиция на которой будет проигрываться звук
 *  Sounds.test - это наш звук из ранее созданного класса Sounds
 *  SoundCategory.PLAYERS - категория звука
 *  1.0 - громкость
 *  1.0 - высота
 *  false - задержка
 */
world.playSound(blockPos, Sounds.test, SoundCategory.PLAYERS, 1.0F, 1.0F, false)
```

Затем зарегистрируем Sounds класс в MinecraftForge.EVENT_BUS и зайдём в игру!