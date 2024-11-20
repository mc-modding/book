description: Основы создания предметов

# Начало

При написании мода так или иначе стоит начать с создания предмета и/или блока, а уже позже наделять этот предмет/блок какими-то особенностями. В целом, есть множество способов создать предмет, но суть в этом только одна: создать void registerItems() и вызвать эту функцию в основном классе вашего мода.  
Мы имеем примерно такой формат нашего мода:
```md
└── src    
    └── main
        ├── java
            └── com
                └── example
                    └── exaplemod
                        ├──items
                            └── ModItems
                        └── ExampleMod.java
        └── resources
```

Для удобвства давайте немного изменим наш основной класс мода, он у вас выглядит сейчас примерно так (могут быть отличия, файл взят с примера мода из forge 1.16.5 36.2.34-mdk):
```java
package com.example.examplemod;

import ...

@Mod("examplemod")
public class ExampleMod
{
    // Directly reference a log4j logger.
    private static final Logger LOGGER = LogManager.getLogger();

    public ExampleMod() {
        // Register the setup method for modloading
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::setup);
        // Register the enqueueIMC method for modloading
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::enqueueIMC);
        // Register the processIMC method for modloading
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::processIMC);
        // Register the doClientStuff method for modloading
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::doClientStuff);

        // Register ourselves for server and other game events we are interested in
        MinecraftForge.EVENT_BUS.register(this);
    }

	...

}
```

Будущий ты скажешь спасибо вот за изменение на это:
```java
package com.example.examplemod;

import ...

@Mod(ExampleMod.MOD_ID)
public class ExampleMod
{
    public static final String MOD_ID = "examplemod";
	
    // Directly reference a log4j logger.
    private static final Logger LOGGER = LogManager.getLogger();

    public ExampleMod() {
        IEventBus eventBus = FMLJavaModLoadingContext.get().getModEventBus();
		
        //eventBus.addGenericListener(Item.class, ModItems::registerItems); На будущее для первого способа, т.к. сейчас у нас нет никакого registerItems в ModItems
        //ModItems.registerItems(eventBus); На будущее для второго способа, т.к. сейчас у нас нет никакого registerItems в ModItems
    }

	...

}
```

## Основа. Способ первый.

Создаем класс с названием предмета, который вы хотите добавить (не обязательно несущий смысл):
```java
package ru.mcmodding.tutorial.common.item;

import net.minecraft.item.Item;

// На самом деле, делать это не обязательно, т.к. можно в ModItems указать все свойства предмета. 
// Однако, для предмета со сложным поведением эта процедура обязательна
public class Coin extends Item {
    public Coin() {
        super(new Item.Properties());
    }
}
```

Где после Properties() через точку определяем свойства нашего предмета. Среда разработки после того, как поставите точку сама подскажет вам те свойства, которые можно придать предмету, да и в зависимости от маппингов названия могут меняться, так что смысла не имеет перечислять их здесь все.
В файле ModItems мы создаем эту монетку и регестрируем ее:
```java
package com.example.examplemod.items;

import net.minecraftforge.eventbus.api.Event;

public class ModItems {
    public static <V extends IForgeRegistryEntry<V>> void register(
            IForgeRegistry<V> reg, ResourceLocation name, IForgeRegistryEntry<V> thing) {
        reg.register(thing.setRegistryName(name));
    }

    public static final Coin coin = new Coin();
	// Или же просто вот так и через точку указать свойства:
	// public static final Item coin = new Item(new Item.Properties());
	
	// Ну или же на край вот так:
	// public static final Item coin = new Coin();
	 
    public static void registerItems(RegistryEvent.Register<Item> evt) {
        IForgeRegistry<Item> r = evt.getRegistry();
		
        register(r, new ResourceLocation(ExampleMod.MOD_ID, "coin");, coin);
    }
}
```

Конечно же, все это безобразие можно разнести по сотням разных функций и даже разнести по разным папкам, следуя заветам чистого кода:
```java
public class ModItems {
    public static ResourceLocation prefix(String path) {
        return new ResourceLocation(Bifrost.MOD_ID, path);
    }
	
    public static <V extends IForgeRegistryEntry<V>> void register(
            IForgeRegistry<V> reg, ResourceLocation name, IForgeRegistryEntry<V> thing) {
        reg.register(thing.setRegistryName(name));
    }
	
    public static <V extends IForgeRegistryEntry<V>> void register(
            IForgeRegistry<V> reg, String name, IForgeRegistryEntry<V> thing) {
        register(reg, prefix(name), thing);
    }
	
    public static final Coin coin = new Coin();
    // Или же просто вот так и через точку указать свойства:
    // public static final Item coin = new Item(new Item.Properties());
	
    // Ну или же на край вот так:
    // public static final Item coin = new Coin();
	
    public static void registerItems(RegistryEvent.Register<Item> evt) {
        IForgeRegistry<Item> r = evt.getRegistry();
		
		//Даже "coin" можно вынести в какой-нибудь LibItemNames или что-то в этом роде
        register(r, "coin", coin);
    }
}
```

## Основа. Способ второй.

В целом, мы можем просто делать то же самое, но другим способом, тогда наш класс ModItems будет выглядеть так:
```java
public class ModItems {
// Создадим отложенный регистр, в который будет помещаться предметы
    public static final DeferredRegister<Item> ITEMS =
        DeferredRegister.create(ForgeRegistries.ITEMS, ExampleMod.MOD_ID);

    // Создаем предмет, опять же, new Item(new Item.Properies()) можно заменять на нечто другое
    public static final RegistryObject<Item> coin = ITEMS.register("coin",
        () -> new Item(new Item.Properties())
    );
		
    // Добавялем обработчик событий в шину, это обязательная процедура
    public static void registerItems(IEventBus eventBus) {
        ITEMS.register(eventBus);
    }
}
```

По примеру выше мы также можем разбить это действие на разные функции, но ведь пользователи не увидят красоту вашего мода, так ведь?

## Добавление файла перевода

Зайдя в мир мы можем увидеть в какой-нибудь из вкладок креатива(если вы указали это в свойствах, естественно) наш предмет. У него нет и не должно быть никакой модели и перевода.
В папке lang создадим файл en_us.json (если требуется перевод на русский язык, то параллельно надо создать ru_ru.json):
```md
└── src    
    └── main
        ├── java
        └── resources
            └── assets
                └── examplemod
                    └── lang
                        └── en_us.json
                    └── models
                        └── item
                    └── textures
                        └── item
```

Заполним его следующим образом, следующие предметы можно перечислять через запятую. Вторые кавычки и есть наш перевод, поэтому в ru_ru.json можно смело менять на "Монета"
```java
{
    "item.examplemod.coin": "Coin"
}
```

## Добавление файла .png для предмета

В папке item создадим файл coin.json:
```java
{
    "parent": "item/generated",
    "textures": {
    "layer0": "examplemod:item/coin"
  }
}
```

Обязательно по пути src.main.resources.assets.examplemod.textures.item должен быть файл формата png с названием coin, а иначе чудо не случится.
При желании добавить анимацию к текстуре мы просто делаем полоску из меняющейся текстуры и добавляем в textures.item файл coin.mcmeta:
```java
{
    "animation": {
        "frametime": 4,
        "frames": [
            0,
            1,
            2
        ]
    }
}
```
