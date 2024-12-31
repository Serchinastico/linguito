import { Project } from "@app/domain/project";
import { ExportThemeId } from "@app/domain/project/export";
import {
  AddContent,
  NormalizeCss,
  RemoveTitleBackground,
} from "@app/features/tools/hooks/pdf/processing";
import { TransformImageSourcesToBase64 } from "@app/features/tools/hooks/pdf/processing/transformImageSourcesToBase64";
import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import { Asset } from "expo-asset";
import {
  cacheDirectory,
  makeDirectoryAsync,
  moveAsync,
  readAsStringAsync,
} from "expo-file-system";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { useCallback, useMemo } from "react";

const darkThemeHtmlRef = require("../../../../editor-web/build-manual-dark/index.html");
const lightThemeHtmlRef = require("../../../../editor-web/build-manual-light/index.html");

export const usePdfExporter = () => {
  const exportDirectory = useMemo(() => `${cacheDirectory}Export`, []);

  const sharePdf = useCallback(
    async ({
      project,
      themeId,
    }: {
      project: Project;
      themeId: ExportThemeId;
    }) => {
      const assets = await Asset.loadAsync(
        themeId.endsWith("Dark") ? darkThemeHtmlRef : lightThemeHtmlRef
      );

      const asset = assets[0];
      if (!asset) return;
      if (!asset?.localUri) return;

      let processedHtml = await readAsStringAsync(asset.localUri);
      const steps = [
        new NormalizeCss(themeId),
        new AddContent(project.manual!.contentHtml),
        new TransformImageSourcesToBase64(),
        new RemoveTitleBackground(themeId),
      ];

      for (const step of steps) {
        processedHtml = await step.process(processedHtml);
      }

      // Size calculated with https://www.a4-size.com/a4-size-in-pixels/
      const { uri: temporaryUri } = await printToFileAsync({
        height: 842,
        html: processedHtml,
        width: 595,
      });

      const uri = `${exportDirectory}/${t(i18n)`${project.name} - Manual`}.pdf`;

      await makeDirectoryAsync(exportDirectory, { intermediates: true });
      await moveAsync({ from: temporaryUri, to: uri });
      await shareAsync(uri, {
        dialogTitle: t(i18n)`Save or share your project's manual`,
        mimeType: "application/pdf",
        UTI: ".pdf",
      });
    },
    []
  );

  return { sharePdf };
};
