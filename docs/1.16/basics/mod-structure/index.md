description: Основные файлы любого Minecraft мода. Для чего они нужны и как их настроить.

# Структура мода

Так как используемое нами Forge API использует автоматический сборщик Gradle, то мы должны придерживаться определенной
структуры папок.

```md
└── src    
    └── main
        ├── java
        └── resources
```

* В "java" хранится исходный код нашего мода
* В "resources" хранятся все остальные доп. файлы: картинки, звуки, модели и так далее

## mods.toml

В папке "resources/META-INF" распологается файл `mods.toml`.

Этот файл определяет метаданные нашего мода: идентификатор, название, авторов, зависимости и так далее.

В файле обязательные поля обозначены как "mandatory" их необходимо заполнить т.к. у них нет значения по умолчанию, что будет вызывать ошибку, остальные поля являются опциональными.

Минимально правильный mods.toml файл должен содержать следующее:

```toml

modLoader="javafml" 
loaderVersion="[34,)"

[[mods]]
modId="tut"
version="1.16.3-1.0.0"
displayName="Tutorial Mod"

[[dependencies.examplemod]] 
    modId="forge" 
    mandatory=true 
    versionRange="[34,)"
    ordering="NONE"
    side="BOTH"

[[dependencies.examplemod]]
    modId="minecraft"
    mandatory=true
    versionRange="[1.16.3]"
    ordering="NONE"
    side="BOTH"

```

Где `modid` — идентификатор мода. Не используйте заглавные буквы, пробелы, подчеркивания и т.д. Только английские буквы
в нижнем регистре.

Параметр `name` отвечает за красивое название вашего мода. Тут можно использовать все, что угодно. Работать будут и [коды
форматирования текста](http://minecraft.gamepedia.com/Formatting_codes).

| Параметр                 | Описание                                                                                                                                                                                                                      |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| modId                    | Идентификатор мода.                                                                                                                                                                                                             |
| displayName              | Название мода                                                                                                                                                                                                                 |
| description              | Описание мода в 1-2 абзаца                                                                                                                                                                                                    |
| version                  | Версия мода. Это должны быть просто числа, разделенные точками, в идеале, соответствующие [семантическому управлению версиями](../other/semantic-versionong/index.md)                                                                                                                                                                                                                                                                                                                                                     |
| displayURL               | Ссылка на сайт мода                                                                                                                                                                                                           |
| updateJSONURL            | Ссылка на JSON файл с данными обновлений мода                                                                                                                                                                                 |
| authors                  | Строка с авторами                                                                                                                                                                                                            |
| credits                  | Строка с выражением благодарности кому-то                                                                                                                                                                                     |
| logoFile                 | Путь к логотипу мода                                                                                                                                                                                                          |
| dependencies | зависимости мода                                                                                                                                                                            |

Вот пример умеренно заполненного файла:

```toml
modLoader="javafml" 
loaderVersion="[34,)" 
license="All rights reserved"

[[mods]]
modId="tut"
version="1.16.3-1.0.0"
displayName="Tutorial Mod"
logoFile="logo.png"
credits="My fantasy"
authors="Me and that guy in the mirror"
description='''
Bla-bla-bla...
'''
[[dependencies.tut]]
    modId="forge" 
    mandatory=true 
    versionRange="[34,)" 
    ordering="NONE"
    side="BOTH"

[[dependencies.tut]]
    modId="minecraft"
    mandatory=true
    versionRange="[1.16.3]"
    ordering="NONE"
    side="BOTH"

```

Более подробно о настройке этого файла вы можете прочитать в отдельной статье. Рекомендую обязательно выделить время для этого,
так как там есть несколько полезных хитростей.

## Главный файл мода

В предыдущем разделе мы изменили файл `mods.toml`. Но игра всё ещё не запустится, в чем можно убедиться, запустив
клиент. Вам выдаст ошибку. Для того, чтобы все заработало, нам нужно перейти в главный файл мода.

Он распологается в папке "java/com/examplemod/examplemod".

Имя директорий строится так: `URL/ваш никнейм/название мода`. 

Если у вас есть URL-адрес, связанный с вашим проектом, вы можете использовать его в качестве пакета верхнего уровня. 

Например, аккаунт GitHub.com, вы можете использовать com.github в качестве пакета верхнего уровня. При отсутствии домена вполне подойдет использование вашего никнейма, как название пакета верхнего уровня: `IgorDejavu.tutorial`.

В моем случае пакет будет называться так: `com.IgorDejavu.tutorial`.

Теперь создадим в нем файл `Tutorial.java`. Это и будет главным файлом нашего мода.

Для того, чтобы Forge понял, что данный файл действительно является главным, мы должны добавить к определению класса
аннотацию `@Mod`. Значение аннотации @Mod должно соответствовать идентификатору мода в файле `mods.toml`.

В противном случае выведется сообщение о том, что в `mods.toml отсутствуют метаданные на modid`. И не позволит вам запуститься.

```java
package com.IgorDejavu.tutorial;

import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Mod("tut")
public class Tutorial {
	private static final Logger LOGGER = LogManager.getLogger();

	public Tutorial () {
		FMLJavaModLoadingContext.get().getModEventBus().addListener(this::setup);
		FMLJavaModLoadingContext.get().getModEventBus().addListener(this::doClientStuff);

		MinecraftForge.EVENT_BUS.register(this);
	}

	private void setup(final FMLCommonSetupEvent event) {}

	private void doClientStuff(final FMLClientSetupEvent event) {}
}
```

## Итог

Мы изучили базовую структуру любого мода для Minecraft. Выглядит она следующим образом:

```md
└── src    
    └── main
        ├── java
        │   └── url
                 └── никнейм
                        └── мод
        │                    └── ФайлМода.java
        └── resources
            └── META-INF
               └── mods.toml
```