import { test, expect } from '@playwright/test';

test.describe('名刺カードのモバイル表示', () => {
  test('表面が正しく表示される', async ({ page }) => {
    await page.goto('/');

    // 名前が表示されていることを確認
    await expect(page.locator('.name-jp')).toBeVisible();
    await expect(page.locator('.name-jp')).toHaveText('森田 崇司');

    // スクリーンショット比較
    await expect(page).toHaveScreenshot('card-front.png');
  });

  test('裏面のコンテンツがカード枠内に収まっている', async ({ page }) => {
    await page.goto('/');

    // カードをクリックして裏返す
    await page.click('.card');

    // フリップアニメーション完了を待機（CSSトランジション: 0.6s）
    await page.waitForFunction(() => {
      const card = document.querySelector('.card');
      return card?.classList.contains('flipped');
    });
    // トランジション完了まで追加待機
    await page.locator('.card').evaluate((el) => {
      return new Promise((resolve) => {
        el.addEventListener('transitionend', resolve, { once: true });
        // フォールバック: 既にトランジション完了している場合
        setTimeout(resolve, 100);
      });
    });

    // 裏面が表示されていることを確認
    await expect(page.locator('.card-back')).toBeVisible();

    // カードと最後のセクションの境界ボックスを取得
    const cardBack = page.locator('.card-back');
    const lastSection = page.locator('.card-back .section').last();

    const cardBox = await cardBack.boundingBox();
    const sectionBox = await lastSection.boundingBox();

    // 境界ボックスが取得できることを確認（アサーションで型を保証）
    expect(cardBox).not.toBeNull();
    expect(sectionBox).not.toBeNull();

    // TypeScript用の型ガード
    if (!cardBox || !sectionBox) {
      throw new Error('境界ボックスの取得に失敗');
    }

    // 最後のセクションがカードの下端を超えていないことを確認
    const sectionBottom = sectionBox.y + sectionBox.height;
    const cardBottom = cardBox.y + cardBox.height;

    expect(sectionBottom).toBeLessThanOrEqual(cardBottom + 1); // 1pxの許容誤差

    // スクリーンショット比較
    await expect(page).toHaveScreenshot('card-back.png');
  });

  test('カードがフリップする', async ({ page }) => {
    await page.goto('/');

    const card = page.locator('.card');

    // 初期状態ではflippedクラスがない
    await expect(card).not.toHaveClass(/flipped/);

    // クリックでフリップ
    await card.click();
    await expect(card).toHaveClass(/flipped/);

    // 再クリックで元に戻る
    await card.click();
    await expect(card).not.toHaveClass(/flipped/);
  });
});
