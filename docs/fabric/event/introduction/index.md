# Использование событий

Событий в Fabric немного и они очень простые, тем не менее, было бы неплохо их знать и уметь ими пользоваться.

## Коллбэки интерфейсов

Существует серия интерфейсов, которые обрабатывают события и вызывают коллбэки, регистрирующиеся при инициализации мода. Практически все события создаются с помощью Mixins, поэтому нам ничего не стоит создать свои события (об этом позже).

## Прослушивание событий

Рассмотрим работу с событиями на примере изменения таблиц лута.

Fabric API зажжёт событие `LootTableLoadingCallback` при загрузке таблиц лута. Нам необходимо зарегистрировать где-нибудь слушатель, например, в методе `onInitialize()` нашего главного класса.

В таблицах лута предметы расположены в записях лута, а сами записи содержаться в пулах лута. Мы можем сделать пул с помощью `FabricLootPoolBuilder`:

```java
    // ID таблицы лута
    private static final Identifier COAL_ORE_LOOT_TABLE_ID = new Identifier("minecraft", "blocks/coal_ore");

    @Override
    public void onInitialize() {
        FTutItems.init();
        FTutBlocks.init();
        // регистрируем слушатель
        LootTableLoadingCallback.EVENT.register((resourceManager, lootManager, id, supplier, setter) -> {
            if (COAL_ORE_LOOT_TABLE_ID.equals(id)) { // проверяем ID таблицы
                FabricLootPoolBuilder poolBuilder = FabricLootPoolBuilder.builder()
                        .rolls(ConstantLootTableRange.create(1));

                supplier.pool(poolBuilder);
            }
        });
    }
```

Сейчас наш пул не содержит никаких записей, исправим это:

```java
 LootTableLoadingCallback.EVENT.register((resourceManager, lootManager, id, supplier, setter) -> {
            if (COAL_ORE_LOOT_TABLE_ID.equals(id)) {
                FabricLootPoolBuilder poolBuilder = FabricLootPoolBuilder.builder()
                        .rolls(ConstantLootTableRange.create(1))
                        .withEntry(ItemEntry.builder(Items.EGG) // теперь из угольной руды может выпасть яйцо
                        .build());

                supplier.pool(poolBuilder);
            }
        });
```