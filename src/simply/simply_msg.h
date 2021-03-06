#pragma once

#include "simply.h"

#include <pebble.h>

#define TRANSACTION_ID_INVALID (-1)

void simply_msg_init(Simply *simply);
void simply_msg_deinit();
bool simply_msg_has_communicated();

bool simply_msg_single_click(ButtonId button);
bool simply_msg_long_click(ButtonId button);

bool simply_msg_window_show(uint32_t id);
bool simply_msg_window_hide(uint32_t id);

bool simply_msg_accel_tap(AccelAxisType axis, int32_t direction);
bool simply_msg_accel_data(AccelData *accel, uint32_t num_samples, int32_t transaction_id);

bool simply_msg_menu_get_section(uint16_t index);
bool simply_msg_menu_get_item(uint16_t section, uint16_t index);
bool simply_msg_menu_select_click(uint16_t section, uint16_t index);
bool simply_msg_menu_select_long_click(uint16_t section, uint16_t index);
bool simply_msg_menu_hide(uint16_t section, uint16_t index);
